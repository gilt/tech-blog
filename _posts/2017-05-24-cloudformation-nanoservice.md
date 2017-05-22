---
layout: post
title: CloudFormation Nanoservice
author: Ryan Martin
date: '2017-05-19'
categories: 'aws'
tags:
- aws
- cloudformation
- sms
- nanoservice
- api-driven development
- swagger
- apibuilder
- serverless
---

One of the big HBC Digital initiatives for 2017 is "buy online, pickup in store" - somewhat awkwardly nicknamed "BOPIS" internally. This is the option for the customer to, instead of shipping an order to an address, pick it up in a store that has the items in inventory.

A small part of this new feature is the option to be notified of your order status (i.e. when you can pickup the order) via SMS. A further smaller part of the SMS option is what to do when a customer texts "STOP" (or some other similar stop word) in response to one of the SMS notifications. Due to laws such as the Telephone Consumer Protection Act (TCPA) and CAN-SPAM Act, we are required to immediately stop sending additional messages to a phone number, once that person has requested an end to further messaging.

Our SMS provider is able to receive the texted response from the customer and POST it to an endpoint of our choosing. We could wrap such an endpoint into one of our existing microservices, but the one that sends the SMS (our customer-notification-service) is super-simple: it receives order events and sends notifications (via email or SMS) based on the type of event. It is essentially a dumb pipe that doesn't care about orders or users; it watches for events and sends messages to customers based on those events. Wrapping subscription information into this microservice felt like overstepping the bounds of the simple, clean job that it does.

So this is the story of how I found myself writing a very small service (nanoservice, if you will) that does one thing - and does it with close-to-zero maintenance, infrastructure, and overall investment. Furthermore, I decided to see if I could encapsulate it entirely within a single CloudFormation template.


# How we got here

Here are the two things this nanoservice needs to do:

1. Receive the texted response and unsubscribe the customer if necessary
2. Allow the customer notification service (CNS) to check the subscription status of a phone number before sending a SMS

In thinking about the volume of traffic for these two requests, we consider the following:

1. This is on [https://www.saksfifthavenue.com] only (for the moment)
2. Of the online Saks orders, only a subset of inventory is available to be picked up in the store
3. Of the BOPIS-eligible items, only a subset of customers will choose to pickup in store
4. Of those who choose to pickup in store, only a subset will opt-in for SMS messages
5. Of those who opt-in for SMS, only a subset will attempt to stop messages after opting-in

For the service's endpoints, the request volume for the unsub endpoint (#1 above) is roughly the extreme edge case of #5; the CNS check (#2) is the less-edgy-but-still-low-volume #4 above. So we're talking about a very small amount of traffic: at most a couple dozen requests per day. This hardly justifies spinning up a microservice - even if it runs on a t2.nano, you still have the overhead of multiple nodes (for redundancy), deployment, monitoring, and everything else that comes with a new microservice. Seems like a perfect candidate for a serverless approach.


# The architecture

<p align="center">
<img src="http://i.imgur.com/PurR7KJ.png">
</p>

As mentioned above, a series of order events flows to the customer notification service, which checks to make sure that the destination phone number is not blacklisted. If it is not, CNS sends the SMS message through our partner, who in turn delivers the SMS to the customer. If the customer texts a response, our SMS partner proxies that message back to our blacklist service.

The blacklist service is a few Lambda functions behind API Gateway; those Lambda functions simply write to and read from DynamoDB. Because the stack is so simple, it felt like I could define the entire thing in a single artifact: one CloudFormation template. Not only would that be a geeky because-I-can coding challenge, it also felt really clean to be able to deploy a service using only one resource with no dependencies. It's open source, so anyone can literally copy-paste the template into CloudFormation and have the fully-functioning service in the amount of time it takes to spin up the resources - with no further knowledge necessary. Plus, the template is in JSON (which I'll explain later) and the functions are in Node.js, so it's a bit of

<p align="center">
<img src="http://i.imgur.com/Yd6AeB9.png">
</p>


# The API

Here at HBC Digital, we've really started promoting the idea of API-driven development (ADD). I like it a lot because it forces you to fully think through the most important models in your API, how they're defined, and how clients should interact with them. You can iron out a lot of the kinks (Do I _really_ need this property? Do I need a search? How does the client edit? What needs to be exposed vs locked-down? etc) before you write a single line of code.

I like to sit down with a good API document editor such as [SwaggerHub](https://app.swaggerhub.com) and define the entire API at the beginning. The ADD approach worked really well for this project because we needed a quick turnaround time: the blacklist was something we weren't expecting to own internally until very late in the project, so we had to get it in place and fully tested within a week or two. With an API document in hand (particularly one defined in [Swagger](http://swagger.io)), I was able to go from API definition to fully mocked endpoints (in API Gateway) in about 30 mins. The team working on CNS could then generate a client (we like the clients in [Apidoc](http://apidoc.me), an open-source tool developed internally that supports Swagger import) and immediately start integrating against the API. This then freed me to work on the implementation of the blacklist service without being a blocker for the remainder of the team. We settled on the blacklist approach one day; less than 24 hours later we had a full API defined with no blockers for development.

The [API definition](http://ui.apidoc.me/org/gilt/app/blacklist-nanoservice) is fairly generic: it supports blacklisting any uniquely-defined key for any type of notification. The main family of endpoints looks like this:

```
/{notification_type}/{blacklist_id}
```

`notification_type` currently only supports `sms`, but could very easily be expanded to support things like `email`, `push`, `facebook-messenger`, etc. With this, you could blacklist phone numbers for `sms` independently from email addresses for `email` independently from device IDs for `push`.

A simple GET checks to see if the identifier of the destination is blacklisted for that type of notification:

```shell
> curl https://your-blacklist-root/sms/555-555-5555
{"message":"Entry not blacklisted"}
```

This endpoint is used by CNS to determine whether or not it should send the SMS to the customer. In addition to the GET endpoint, the API defines a PUT and a DELETE for manual debugging/cleanup - though a client could also use them directly to maintain the blacklist.

The second important endpoint is a POST that receives a XML document with details about the SMS response:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<moMessage messageId="123456789" receiptDate="YYYY-MM-DD HH:MM:SS Z" attemptNumber="1">
    <source address="+15555555555" carrier="" type="MDN" />
    <destination address="12345" type="SC" />
    <message>Stop texting me</message>
</moMessage>
```

The important bits are the source address (the phone number that sent the message) and the message itself. With those, the API can determine whether or not to add the phone number to the blacklist. If it does, the next time CNS calls the GET endpoint for that phone number, the API will return a positive result for the blacklist and CNS will not send the SMS. The POST to `/mo_message` lives at the top-level because it is only through coincidence that it results in blacklisting for SMS; one could imagine other endpoints at the top-level that blacklist from other types of notifications - or even multiple (depending on the type of event).


# Let's see some [code](https://github.com/gilt/blacklist)

First there are a couple functions shared across all the endpoints (and their backing Lambda functions):

```node
function withSupportedType(event, context, lambdaCallback, callback) {
  const supportedTypes = ['sms'];
  if (supportedTypes.indexOf(event.pathParameters.notification_type.toLowerCase()) >= 0) {
    callback(event.pathParameters.notification_type.toLowerCase());
  } else {
    lambdaCallback(null, { statusCode: 400, body: JSON.stringify({ message: 'Notification type [' + event.pathParameters.notification_type + '] not supported.' }) });
  }
}

function sanitizeNumber(raw) {
  var numbers = raw.replace(/[^\d]+/g, '');
  if (numbers.match(/^1\d{10}$/)) numbers = numbers.substring(1, 11);
  return numbers;
}
```

These are there to ensure that each Lambda function is a) dealing with invalid notification_types and b) cleaning up the phone number in the same manner across all functions. Given those common functions, the amount of code for each function is fairly minimal.

The [GET](https://github.com/gilt/blacklist/blob/master/app/Get.js) endpoint simply queries the DynamoDB for the unique combination of `notification_type` and `blacklist_id`:

```node
const AWS = require('aws-sdk'),
      dynamo = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
  const blacklistId = sanitizeNumber(event.pathParameters.blacklist_id);
  withSupportedType(event, context, callback, function(notificationType) {
    dynamo.getItem({
      TableName: event.stageVariables.TABLE_NAME,
      Key: { Id: { S: blacklistId }, Type: { S: notificationType } }
    }, function(err, data) {
      if (err) return callback(err);
      if ((data && data.Item && afterNow(data, "DeletedAt")) || !onWhitelist(blacklistId, event.stageVariables.WHITELIST)) {
        callback(null, { statusCode: 200, body: JSON.stringify({ id: blacklistId }) });
      } else {
        callback(null, { statusCode: 404, body: JSON.stringify({ message: "Entry not blacklisted" }) });
      }
    })
  });
}

function afterNow(data, propertyName) {
  if (data && data.Item && data.Item[propertyName] && data.Item[propertyName].S) {
    return Date.parse(data.Item[propertyName].S) >= new Date();
  } else {
    return true;
  }
}

// Set the whitelist in staging to only allow certain entries.
function onWhitelist(blacklistId, whitelist) {
  if (whitelist && whitelist.trim() != '') {
    const whitelisted = whitelist.split(',');
    return whitelisted.findIndex(function(item) { return blacklistId == item.trim(); }) >= 0;
  } else {
    return true;
  }
}
```

Disregarding the imports at the top and some minor complexity around a whitelist (which we put in place only for staging/test environments so we don't accidentally spam people while testing), it's about a dozen lines of code (depending on spacing) - with minimal boilerplate. This is the realization of one of the promises of the serverless approach: very little friction against getting directly to the meat of what you're trying to do. There is nothing here about request routing or dependency-injection or model deserialization; the meaningful-code-to-boilerplate ratio is extremely high (though we'll get to deployment later).

The [PUT](https://github.com/gilt/blacklist/blob/master/app/Put.js) (add an entry to the blacklist, managing soft-deletes correctly)

```node
exports.handler = (event, context, callback) => {
  const blacklistId = sanitizeNumber(event.pathParameters.blacklist_id);
  withSupportedType(event, context, callback, function(notificationType) {
    dynamo.updateItem({
      TableName: event.stageVariables.TABLE_NAME,
      Key: { Id: { S: blacklistId }, Type: { S: notificationType } },
      ExpressionAttributeNames: { '#l': 'Log' },
      ExpressionAttributeValues: {
        ':d': { S: (new Date()).toISOString() },
        ':m': { SS: [ toMessageString(event) ] }
      },
      UpdateExpression: 'SET UpdatedAt=:d ADD #l :m REMOVE DeletedAt'
    }, function(err, data) {
      if (err) return callback(err);
      callback(null, { statusCode: 200, body: JSON.stringify({ id: blacklistId }) });
    })
  });
}
```

and [DELETE](https://github.com/gilt/blacklist/blob/master/app/Delete.js) (soft-delete entries when present)

```node
exports.handler = (event, context, callback) => {
  const blacklistId = sanitizeNumber(event.pathParameters.blacklist_id);
  withSupportedType(event, context, callback, function(notificationType) {
    dynamo.updateItem({
      TableName: event.stageVariables.TABLE_NAME,
      Key: { Id: { S: blacklistId }, Type: { S: notificationType } },
      ExpressionAttributeNames: { '#l': 'Log' },
      ExpressionAttributeValues: {
        ':d': { S: (new Date()).toISOString() },
        ':m': { SS: [ toMessageString(event) ] }
      },
      UpdateExpression: 'SET DeletedAt=:d, UpdatedAt=:d ADD #l :m'
    }, function(err, data) {
      if (err) return callback(err);
      callback(null, { statusCode: 200, body: JSON.stringify({ id: blacklistId }) });
    })
  });
}
```

functions are similarly succinct. The [POST](https://github.com/gilt/blacklist/blob/master/app/MoMessage.js) endpoint that receives the moMessage XML is a bit more verbose, but only because of a few additional corner cases (i.e. when the origin phone number or the message isn't present).

```node
exports.handler = (event, context, callback) => {
  const moMessageXml = event.body;
  if (messageMatch = moMessageXml.match(/<message>(.*)<\/message>/)) {
    if (messageMatch[1].toLowerCase().match(process.env.STOP_WORDS)) { // STOP_WORDS should be a Regex
      if (originNumberMatch = moMessageXml.match(/<\s*source\s+.*?address\s*=\s*["'](.*?)["']/)) {
        var originNumber = sanitizeNumber(originNumberMatch[1]);
        dynamo.updateItem({
          TableName: event.stageVariables.TABLE_NAME,
          Key: { Id: { S: originNumber }, Type: { S: 'sms' } },
          ExpressionAttributeNames: { '#l': 'Log' },
          ExpressionAttributeValues: {
            ':d': { S: (new Date()).toISOString() },
            ':m': { SS: [ moMessageXml ] }
          },
          UpdateExpression: 'SET UpdatedAt=:d ADD #l :m REMOVE DeletedAt'
        }, function(err, data) {
          if (err) return callback(err);
          callback(null, { statusCode: 200, body: JSON.stringify({ id: originNumber }) });
        });
      } else {
        callback(null, { statusCode: 400, body: JSON.stringify({ message: 'Missing source address' }) });
      }
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify({ id: '' }) });
    }
  } else {
    callback(null, { statusCode: 400, body: JSON.stringify({ message: 'Invalid message xml' }) });
  }
}
```

A couple things to call out here. First - and I know this looks terrible - this function doesn't parse the XML - it instead uses regular expressions to pull out the data it needs. This is because Node.js doesn't natively support XML parsing and importing a library to do it is not possible given my chosen constraints (the entire service defined in a CloudFormation template); I'll explain further below. Second, there is expected to be a Lambda environment variable named `STOP_WORDS` that contains a regular expression to match the desired stop words (things like stop, unsubscribe, fuck you, etc).

That's pretty much the extent of the production code.


# Deployment - CloudFormation

Here's where this project gets a little verbose. Feel free to reference the [final CloudFormation template](https://github.com/gilt/blacklist/blob/master/cloudformation/deploy-blacklist.template) as we go through this. In broad strokes, this template matches the simple architecture diagram above: API Gateway calls Lambda functions which each interact with the same DynamoDB database. The bottom of the stack (i.e. the top of the template) is fairly simple: two DynamoDBs (one for prod, one for stage) and an IAM role that allows the Lambda functions to access the databases.

On top of that are the four Lambda functions - which contain the Node.js code (this is the "YO DAWG" part, since the Javascript is _in_ the JSON template) - plus individual permissions for API gateway to call each function. This section (at the bottom of the template) is long but is mostly code-generated (we'll get to that later).

In the middle of the template lie a bunch of CloudFormation resources that define the API Gateway magic: a top-level Api record; resources that define the path components under that Api; methods that define the endpoints and which Lambda functions they call; separate configurations for stage vs prod. At this point, we're just going to avert our eyes and reluctantly admit that, okay, fine, serverless still requires some boilerplate (just not inline with the code, damn it!). At some level, every service needs to define its endpoints; this is where our blacklist nanoservice does it.

All-in, the CloudFormation template approaches 1000 lines (fully linted, mind you, so there are a bunch of lines with just tabs and curly brackets). "But wait!" you say, "Doesn't CloudFormation support YAML now?" Why yes, yes it does. I even started writing the template in YAML until I realized I shouldn't.


# Bringing CloudFormation together with Node.js

To fully embed the Node.js functions inside the CloudFormation template would have been terrible. How would you run the code? How would you test it? A cycle of: tweak the code => deploy the template to the CloudFormation stack => manually QA - that would be a painful way of working. It's unequivocally best to be able to write fully isolated and functioning [Node.js code](https://github.com/gilt/blacklist/tree/master/app), plus [unit tests](https://github.com/gilt/blacklist/tree/master/test/app) in a standard manner. The problem is that Node.js code then needs to be zipped and uploaded to S3 and referenced by the CloudFormation template - which would create a dependency for the template and would not have achieved the goal of defining the entire service in a single template with no dependencies.

To resolve this, I wrote a [small packaging script](https://github.com/gilt/blacklist/blob/master/bin/package.js) that reads the app's files and embeds them in the CloudFormation template. This can then be run after every code change (which obviously would have unit tests and a passing CI build), to keep the template inline with all code changes. The script is written in Node.js (hey, if you're running tests locally, you must already have Node.js installed locally), so a CloudFormation template written in JSON (as opposed to YAML) is essentially native - no parsing necessary. The script can load the template as JSON, inject a CloudFormation resource for each function in the `/app` directory, copy that function's code into the resource, and iterate. Which brings us to

<p align="center">
<img src="http://i.imgur.com/ffgqeh7.png">
</p>

The other thing to note about going down the path of embedding the Node.js code directly in the CloudFormation template (as opposed to packaging it in a zip file): all code for a function must be fully contained within that function definition (other than the natively supported AWS SDK). This has two implications: first, we can't include external libraries such as a XML parser or a Promise framework (notice all the code around callbacks, which makes the functions a little more verbose than I'd like). Second, we can't DRY out the functions by including common functions in a shared library; thus they are repeated in the code for each individual function.


# Conclusion

So that's it: we end up with a 1000-line CloudFormation template that entirely defines a blacklist nanoservice that exposes four endpoints and runs entirely serverless. It is fully tested, can run as a true Node.js app (if you want), and will likely consume so few resources that it is essentially free. We don't need to monitor application servers, we don't need to administer databases, we don't need any non-standard deployment tooling. And there are even separate stage and production versions.

You can try it out for yourself by building a CloudFormation stack using the [template](https://github.com/gilt/blacklist/blob/master/cloudformation/deploy-blacklist.template). Enjoy!

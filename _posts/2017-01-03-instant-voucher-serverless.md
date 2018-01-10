---
layout: post
title: "Revitalize Gilt City's Order Processing with Serverless Architecture"
author: Liyu Ma
date: '2017-01-05'
categories: 
- aws
tags:
- aws
- serverless
- lambda
- step function
- gilt city
- order processing
---

# Instant Vouchers Initiative

[Gilt City](https://www.gilt.com/city/) is Gilt's high-end voucher portal that offers localised discounts on exclusive lifestyle experiences in dining, entertainment, beauty, fitness etc to our 3.4 million members across 13 U.S. cities. Gilt City's legacy order processing backend is a scheduled-job based architecture in which functionality such as fraud scan, payment authorisation, order fulfillment are assigned to independent jobs that process orders in batch according to order status. Though this architecture can scale to meet peak time workload and provides some level of resilience (failed orders are retried the next time the job runs), it inevitably includes some idle time i.e. wait for next job to pick up order from previous job. The resulting average processing time could add up to 15~30 minutes. 

Since many of Gilt City’s offers are of impulsive nature and time-sensitive, long processing time becomes a clear bottleneck to user experience and development of new features. Team Marconi in Gilt have been driving the work on the Instant Vouchers Initiative for the past few months ago, in an effort to re-architect the backend of order processing using the latest cloud technologies. We believe that by reducing this wait time, it will significantly boost overall shopping experience and enable immediate use of vouchers.
  

# An Event Driven, Serverless Architecture

It is never easy to rewrite (or replace) a mission critical system. In our case, we have to keep the existing monolithic Ruby on Rails app running while spinning up a new pipeline. We took the strangler pattern (see this [Martin Fowler article](https://martinfowler.com/bliki/StranglerApplication.html) for an explanation) and built a new API layer for processing individual orders around the existing batch-processing, job-based system in the same Rails app. With this approach, the legacy job-based system gradually receives less traffic and becomes a fallback safety net to catch and retry failed orders from instant pipeline.

The new instant order pipeline starts with the **checkout system** publishing a notification to an SNS topic whenever it creates an order object. An order notification contains the order ID to allow event subscribers to look up the order object in the orders key-value store. An AWS Lambda application **order-notification-dispatcher** subscribes to this SNS topic and kicks off the processing by invoking an AWS Step Functions resource. See below a simplified architecture diagram of the order processing system.

The architecture leverages Lambda and Step Functions from the AWS Serverless suite to build several key components. At HBC, different teams have started embracing a serverless paradigm to build production applications. There are many benefits of adopting a serverless paradigm, such as abstraction from infrastructure, out-of-the-box scalability, an on-demand cost model just to name a few. Compared to the alternative of building and maintaining an array of EC2/container instances, a serverless architecture goes a step beyond microservices to allow an even faster iteration cycle within the Software Development Life Cycle (SDLC). With the use of Step Functions as an orchestration engine, it is much easier to facilitate interaction between Lambda applications. 

![alt text](https://i.imgur.com/2FYlarr.png "Instant Order Processing Architecture")


# AWS Step Functions for Lambda Orchestration

As mentioned above, AWS Step Functions is an orchestration service that makes it easy to coordinate stateless Lambda applications by establishing a specification to transition application states. Behind the scenes, it is depicted as a state machine constructed with the JSON-based [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html). See below a sample execution from the order-processing step function.

![alt text](https://i.imgur.com/xROzpZV.png "An successful Step Function execution example")

### Inside Step Functions

At the top level the specification includes various types of [States](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-states.html), such as `Task`, `Choice` and `Wait`, to be used to compose simple business logic to transition application state. Inside a `Task` state, an AWS Lambda ARN can be specified to be invoked. The output of the Lambda will be directed as input to next State. This is an excerpt from the order-processing state machine:

```json
{
  "Comment": "Order processing state machine",
  "StartAt": "ChangeOrderStatus",
  "States": {
    "ChangeOrderStatus": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:1234567890:function:start-order-processing:2",
      "TimeoutSeconds": 30,
      "Next": "FraudScan"
    },
    "FraudScan": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:1234567890:function:fraud-scan:2",
      "TimeoutSeconds": 30,      
      "Next": "IsFraudOrder"
    },
    "IsFraudOrder": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.fraud_verdict",
          "StringEquals": "cleared",
          "Next": "AuthorizePayment"
        },
        {
          "Variable": "$.fraud_verdict",
          "StringEquals": "fraud",
          "Next": "FraudOrderTerminal"
        }
        ...
      ]      
    },    
    "AuthorizePayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:1234567890:function:authorize-payments:2",
      "TimeoutSeconds": 30,      
      "Next": "WarehouseChoice"
    },
    "FraudOrderTerminal": {
      "Type": "Pass",      
      "Result": "This is the ending state for a fraud order",
      "End": true
    }
    ...
  }
}
```

### Polling and Retry on Errors

A serverless paradigm fits really well in situations where computation completes within a short time (ideally seconds). However, sometimes we still need to run a task that will take slightly longer. For example, in our pipeline, we need to keep polling a service endpoint for a fraud-scan result, since it is an async process. We implemented this by defining a retry counter `get_fraud_status_retries` within a `Choice` state and set a max attempt count of 60 to terminate retries.

```json
"IsFraudOrder": {
  "Type": "Choice",
  "Choices": [
    {
      "Variable": "$.fraud_verdict",
      "StringEquals": "cleared",
      "Next": "AuthorizePayment"
    },
    {
      "Variable": "$.fraud_verdict",
      "StringEquals": "fraud",
      "Next": "FraudOrderTerminal"
    },        
    {
      "Variable": "$.get_fraud_status_retries",
      "NumericLessThanEquals": 60,
      "Next": "FraudScanWait"
    },
    {
      "Variable": "$.get_fraud_status_retries",
      "NumericGreaterThan": 60,
      "Next": "FraudStatusUnavailableTerminal"
    }
  ]      
}
```

It is also critical to make cloud applications resilient to errors such as network timeouts. Step Functions provides error handling to allow catching/retrying some predefined errors as well as customised Lambda error types. You can specify different retry strategies with properties such as `MaxAttempts` and `BackoffRate`. See the below example where we implemented a retry mechanism for different errors in the `Task` state to create redemption codes:

```json
"CreateRedemptionCode": {
  "Type": "Task",
  "Resource": "arn:aws:lambda:us-east-1:1234567890:function:create-redemption-code:3",
  "TimeoutSeconds": 30,
  "Next": "FulfillElectronicOrder",
  "Retry": [
    {
      "ErrorEquals": [ "GatewayTimeoutError" ],
      "IntervalSeconds": 5,
      "MaxAttempts": 2
    }
  ],
  "Catch": [            
    {
      "ErrorEquals": [ "States.ALL" ],
      "Next": "CatchMissingRedemptionCode"
    }
  ]
}
```

# Immutable Deployment & Partial Rollout

Deploying a mission critical service to a production environment is always a nervous process. At HBC we advocate immutable deployments whenever possible and leverage A/B test to help us roll out new features to customers in a gradual manner. In a serverless world, it is a little different, since most of the infrastructure management is abstracted away. 

### Lambda Versioning
AWS Lambda's [versioning feature](https://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html) provides the ability to make Lambda functions immutable by taking a snapshot of the function (aka publishing a version). We really like this, since it ensures the Lambda function artifact as well as environment variables remain immutable once published. Note that in the above code snippets of state machine JSON, the ARN specified for each Lambda resource is Lambda version ARN instead of function ARN. We also use Lambda's [aliasing feature](https://docs.aws.amazon.com/lambda/latest/dg/aliases-intro.html) to have a `prod` alias mapped to the current production version, with immutable environment variables:

![alt text](https://i.imgur.com/Rj7UeTy.png "Lambda Alias Mapping")

With aliasing we can easily roll back to a previous Lambda version in case of an unexpected production failure.

### Blue/Green Stacks

So we have immutable Lambda functions, but we still want to make our Step Functions (SF) immutable. We decided to create a new SF resource every time we release it, meanwhile the old SF resource remains unchanged. Since AWS does not currently provide a versioning feature for Step Functions, we included semantic versioning in the SF name e.g. `order-processing-v0.0.6`. With both new and old versions (including historical SFs) we are able to apply a blue/green deployment and rollback procedure. 

To route orders to either blue/green stack, we make the **order-notification-dispatcher** Lambda the de facto router by providing blue/green versions of SF as its [environment variables](https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html). Here is the Node.js code to read the stack environment variables:
```javascript
const stateMachineBlueVer = process.env.STATE_MACHINE_BLUE_VER;
const stateMachineGreenVer = process.env.STATE_MACHINE_GREEN_VER;
```

With fetched state machine stack version we can compose Step Function ARN with predefined format, then start a new execution with AWS sdk Step Function api:
```javascript
function dispatch(orderJson) {
  const orderId = orderJson.order_id;
  const stateMachine = preProcessingStepFunctionPrefix + stateMachineVersion; 
  const params = {
    stateMachineArn: stateMachine,
    name: orderId.toString(),
    input: JSON.stringify(orderJson)
  };  
  return new AWS.StepFunctions().startExecution(params).promise();
}
```


### Partial Rollout

We make the **order-notification-dispatcher** query our a/b test engine to have simple routing logic for each order notification, so that it can shift traffic to either the blue/green Step Function stack according to test/control group the order falls into. Also note that AWS recently released a nice [traffic shifting](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) feature for Lambda applications. However, we didn't use it as our a/b test engine provides finer-grain control which allows us to target certain groups such as HBC's internal employees. Here is a diagram depicting the partial rollout process for new Step Function resources:

![alt text](https://i.imgur.com/pT48c3C.png "Partial Rollout Process")

# Conclusion

### What We Have Achieved

As of today all of Gilt City's orders have been directed to the instant processing pipeline, which shortens the majority of orders' processing time from over 15 minutes to a few seconds. We are looking to expand the system to take over more workload including physical products to bring the instant order user experience to a wider customer base.

### Step Functions Limitations

From our development exerience using AWS Step Functions we discovered some limitations of this service.

First of all, it lacks of a feature like a `Map` state which would take a list of input objects and transform it to another list of result objects. In our case, an order object can be split into multiple order objects depending on the items in the original order. Unfortuntely SF does not offer a State type that can map a dynamic number of elements. We eventually made the workaround by creating a **order-pre-processing** Step Function and make it invoke the **order-processing** Step Function multiple times to process those 'split' orders.

Secondly, we hope AWS can provide versioning/aliasing for Step Functions so we can gain immutability out of the box instead of forcing immutability on our side. Any support for blue/green deployment would be even better.

Also, we expect AWS to provide better filtering/searching abilities on the Step Function dashboard so we can gain some fundamental data analytics from historical executions. This could be obtained by declaring some "searchable" fields and relative types in the SF definition.

### Future Work
From an architecture perspective, we are trying to standardize a continous delivery process for our serverless components. At the moment, what we have is "poor man's CI/CD" - some bash/node scripts which use AWS CloudFormation SDK to provision resources. There are varioius tools available either from AWS or the serverless community such as [Terraform](https://www.terraform.io/), [CodePipeline](https://aws.amazon.com/documentation/codepipeline/) that we are trying to integrate with to provide a frictionless process to production.

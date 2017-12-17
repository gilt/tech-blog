---
layout: post
title: Codedeploy Notifications as a Service
author: Emerson Loureiro
date: '2016-02-10'
categories: 
- aws
tags:
- aws
- codedeploy
- newrelic
- notifications
redirect_to:
- https://tech.hbc.com/2016-02-10-codedeploy-notifications.html
---

After moving our software stack to AWS, some of us here at Gilt have started deploying our services to production using [AWS's Codedeploy](https://aws.amazon.com/documentation/codedeploy/). Before that, in a not-so-distant past, we used an in-house tool for deployments - IonCannon. One of the things IonCannon provided were deployment notifications. In particular, it would:

1. Send an email to the developer who pushed the deployment, for successful and failed deployments;
2. Send a new deployment notification to Newrelic;
3. Optionally, send a Hipchat message to a pre-configured room, also for successful and failed deployments.

These notifications had a few advantages.

1. If you - like me - prefer to switch to something else while the deployment is ongoing, you would probably want to be notified when it is finished; i.e., "don't call me, I'll call you"-sort of thing. The email notifications were a good fit for that;
2. Having notifications sent via more open channels, like Newrelic and Hipchat, meant that anyone in the team - or in the company really - could quickly check when a given service was released, which version was released, whether it was out on a canary or all production nodes, etc. In Newrelic, in particular, one can see for example, all deployments for a given time range and filter out errors based on specific deployments. These can come in handy when trying to identify a potentially broken release.

Codedeploy, however, doesn't provide anything out-of-the-box for deployment notifications. With that in mind, we have started looking at the different options available to achieve that. For example, AWS itself has the necessary components to get that working - e.g., SNS topics, Codedeploy hooks - but that means you have to do the gluing between your application and those components yourself and, with Codedeploy hooks in particular, on an application-by-application basis. Initially, what some of us have done was a really simple Newrelic deployment notification, by hitting Newrelic's deployment API in the Codedeploy healthcheck script. This approach worked well for **successful** deployments. Because the healthcheck script is the last hook called by Codedeploy, it was safe to assume the deployment was successful. It was also good for realtime purposes, i.e., the deployment notification would be triggered at the same as the deployment itself.

Despite that, one can easily think of more complicated workflows. For example, let's say I want to notify on failed deployments now. Since a failure can happen at any stage of the deployment, the healthcheck hook will not even be called in those cases. Apart from failed deployments, it's reasonable to think about notifications via email, SNS topics, and so on. All of that essentially means adding various logic to different Codedeploy hooks, triggering the notifications "manually" from there - which for things like sending an email isn't as simple as hitting an endpoint. Duplication of that logic across different services is then inevitable. An alternative to that would be Cloudtrail and a Lambda. However, given the delay for delivering Cloudtrail log files to S3, we would lose too much on the realtime aspect of the notifications. One good aspect of this approach, though, is that it could handle different applications with a single Lambda.

So, the ideal approach here would be one that could deliver realtime notifications - or as close to that as possible - and handle multiple Codedeploy applications. Given that, the solution we have been using to some extent here at Gilt is to provide deployment notifications in a configurable way, as a service, by talking directly to Codedeploy. Below is a high-level view of our solution. In essence, our codedeploy notifications service gets deployments directly from Codedeploy and relies on a number of different channels - e.g., SNS, SES, Newrelic, Hipchat - for sending out deployment notifications. These channels are implemented and plugged in as we need though, so not really part of the core of our service. Dynamo DB is used for persisting registrations - more on that below - and successful notifications - to prevent duplications.

![fancy highlevel view](http://i.imgur.com/iiRM48O.png){: .center style="width: 700px;"}

We have decided to require explicit *registration* for any application that we would want to have deployment notifications. There are two reasons for doing this. First, our service runs in an account where different applications - from different teams - are running, so we wanted the ability to select which of those would have deployment notifications triggered. Second, as part of registering the application, we wanted the ability to define over which channels those notifications would be triggered. So our service provides an endpoint that takes care of registering a Codedeploy application. Here's what a request to this endpoint look like.

```bash
curl -H 'Content-type: application/json' -X POST -d '{ "codedeploy_application_name": "CODE_DEPLOY_APPLICATION_NAME", "notifications": [ { "newrelic_notification": { "application_name": "NEWRELIC_APPLICATION_NAME" } } ] }' 'http://localhost:9000/registrations'
```

This will register a Codedeploy application and set it up for Newrelic notifications. The Codedeploy application name -`CODE_DEPLOY_APPLICATION_NAME` above - is used for fetching deployments, so it needs to be the exact name of the application in Codedeploy. The Newrelic application name -  `NEWRELIC_APPLICATION_NAME` - on the other hand, is used to tell Newrelic which application the deployment notification belongs to. Even though we have only illustrated a single channel above, multiple ones can be provided, each always containing setup specific to that channel - e.g., SMTP server for Emails, topic name for SNS.

For each registered application, the service then queries Codedeploy for all deployments across all of their deployment groups, for a given time window. Any deployment marked as successful will have a notification triggered over all channels configured for that application. Each successful notification is then saved in Dynamo. That's done on scheduled-basis - i.e., every time a pre-configured amount of time passes the service checks again for deployments. This means we can make the deployment notifications as realtime as possible, by just adjusting the scheduling frequency.

Our idea of a notification channel is completely generic. In other words, it's independent with regards to the reason behind the notification. In that sense, it would be perfectly possible to register Newrelic notifications for failed deployments - even though in practical terms it would be a bit of nonsense, given Newrelic notifications are meant for successful deployments only. We leave it up to those registering their applications to make sure the setup is sound.

Even though we have talked about a single service doing all of the above, our solution, in fact, is split into two projects. One is a library - codedeploy-notifications - which provides an API for adding registrations, listing Codedeploy deployments, and triggering notifications. The service is then separate, simply integrating with the library. For example, for the registration endpoint we described above, the service uses the following API from codedeploy-notifications under the hood.

```scala
val amazonDynamoClient = ...
val registrationDao = new DynamoDbRegistrationDao(amazonDynamoClient)
val newRelicNotificationSetup = NewrelicNotificationSetup("NewrelicApplicationName")
val newRegistration = NewRegistration("CodedeployApplicationName", Seq(newRelicNotificationSetup))
registrationDao.newRegistration(newRegistration)
```

Splitting things this way means that the library - being free from anything Gilt-specific - can be open-sourced much more easily. Also, it gives users the freedom to choose how to integrate with it. Whereas we currently have it integrated with a small dedicated service, on a T2 Nano instance, others may find it better to integrate it with a service responsible for doing multiple things. Even though the service itself isn't something open-sourcable - as it would contain API keys, passwords, and such - and it's currently being owned by one team only, it is still generic enough so it can be used by other teams.

We have been using this approach for some of our Codedeploy applications, and have been quite happy with the results. The notifications are being triggered with minimal delay - within a couple of seconds for the vast majority of the deployments and under 10 seconds in the worst-case scenarios. The codedeploy-notifications library is open source from day 1 and available [here](https://github.com/emersonloureiro/codedeploy-notifications). It currently supports Newrelic notifications, for successful deployments, and there is current work to support Emails as well as notifications for failed deployments. Suggestions, comments, and contributions are, of course, always welcome.

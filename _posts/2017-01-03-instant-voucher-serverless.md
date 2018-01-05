---
layout: post
title: "Revitalise Gilt City's Order Processing with Serverless Architecture"
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

[Gilt City](https://www.gilt.com/city/) is Gilt's high-end voucher portal that offers localised discounts on exclusive lifestyle experiences in dining, entertainment, beauty, fitness etc to our 3.4 million members across 13 U.S. cities. Gilt City's legacy order processing backend is a scheduled-job based architecture in which functionality such as fraud scan, payment authorisation, order fulfilment are assigned to independent jobs that process orders in batch. Though this architecture can scale to meet peak time workload and provides some level of resilience (failed orders are retried next time job runs), it inevitably includes some idle time i.e. wait for next job to pick up order from previous job. The resulting average processing time could add up to 15~30 minutes. 

Since many of Gilt City’s offers are of impulsive nature and time-sensitive, long processing time becomes a clear bottleneck to user experience and feature development. We believe that by reducing this wait time, it will significantly boost overall shopping experience. Imagine that if users can receive their voucher immediately after placing an order, they are more likely to use it sooner after.
  

# An Event Driven, Serverless Architecture

It is never easy to rewrite (or replace) a mission critical system. In our case, we have to keep existing monolithic ruby & rails app running while spinning up new pipeline. We took the strangler pattern (see this [Martin Fowler’s article](https://martinfowler.com/bliki/StranglerApplication.html) for strangler concept) and built a new per-order-processing api layer around existing batch-processing, job-based system in the same r&r app. With this approach, the legacy job-based system gradually receives less traffic and becomes a fallback safety net to catch and retry failed orders from instant pipeline.

The new instant order pipeline starts with order-service publishing a notification to an SNS topic whenever it creates an order object. An order notification contains essential order properties such as order_id, user_guid, unit_id etc to allow event subscribers looking up the order object in orders key-value store. An AWS Lambda application order-notification-dispatcher subscribes to this SNS topic and kicks off the processing by invoking an AWS Step Function resource. See below a simplified architecture diagram of the order processing system.

The architecture leverages Lambda and Step Function from AWS Serverless suite to build several key components. At Gilt, different teams have started embracing serverless paradigm to build production applications. There are many benefits from adoption of serverless paradigm, such as abstraction from infrastructure, out of box scalability, on-demand cost model etc just to name a few. Comparing to the alternative of building and maintaining an array of EC2/container instances, serverless architecture takes a step further from microservices to allow even faster iteration cycle within SDLC. With the use of Step Function as orchestrating engine, it is mucher easier to facilitate communication between Lambda applications. 

<p align="center">
<img src="https://imgur.com/a/iQSZJ"/>
</p>


# AWS Step Function for Lambda Orchestration

As mentioned above, AWS Step Function is an orchestrating service which makes it easy to coordinates stateless Lambda applications by establishing a specification to transition application states. Behind the scene it is depicted as a state machine constructed with JSON based [Amazone State Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html). See below a sample execution from order-processing step function.

<p align="center">
<img src="https://imgur.com/a/JsZqN"/>
</p>

At the top level the specification include various types of [States](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-states.html) such as Task, Choice, Wait to be used to compose simple business logic to transition application state. inside a Task state, an AWS Lambda arn can be specified to be executed as task. The output of the Lambda will be directed as input of next State. It also provides powerful error handling which allows catching customised errors and different retry strategies. This is some sample json spec from the order-processing state machine:

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
      "Result": "This is ending state for fraud order",
      "End": true
    }
    ...
  }
}
```

# Immutable Deployment & Partial Rollout

Deploying a mission critical service to production environment is always a nervous process. At Gilt we advocate immutable deployment whenever possible and leverage AB test to help us roll out new features to customers in a gradual manner. In serverless world it is a little different since most of the infrastructure management is abstracted away but on the other side it could be simpler. 

AWS Lambda's [versioning](https://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html) feature provides the ability to make Lambda function immutable by publishing a version (snapshot) of the application. We really like this since it ensures the Lambda application artifact as well as environment variabels cannot be modified once published. Note that in the above code snippets of state machine json, the ARN specified for each Lambda resource is Lambda version ARN instead of function ARN. We also use Lambda's [aliasing](https://docs.aws.amazon.com/lambda/latest/dg/aliases-intro.html) feature to have a **prod** alias mapping to current production version:

<p align="center">
  <img src="https://imgur.com/a/GGFrI"/>
</p>

With aliasing we can easily roll back to previous Lambda version in case of unexpected production failure.

So we have immutable Lambda functions, but we still want to make our Step Functions immutable. We decide to create new Step Function resource every time we release it, meanwhile the old SF resource remains unchanged. Since AWS does not provide versioning feature for Step Function we include semantic versioning in the Step Function name e.g. order-processing-v0.0.6. With both new and old versions (including historical SFs) it is easy to apply blue/green deployment and rollback procedure. 

There are 2 places in this architecture where we query our abtest service to get variance control for each order. The 1st place is in order-service where we control whether an order goes to new processing pipeline or legacy system. The 2nd one is in order-notification-dispatcher where we use it to shift the traffic to blue/green Step Function stacks. Also note that AWS recently released a nice [traffic shifting](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) feature for Lambda application. Here we didn't use it since our abtest engine provides finer-granular control which can target to certain group such as Gilt's internal employees. 


# Conclusion and Future Work

As of today all of Gilt City's orders have been directed to instant processing pipeline, which shortens the majority orders' processing time from over 15 minutes to within seconds. We are looking to expand the system to take over more workload including sales items, so to bring the instant order user experience to wider customer base.

From architecture perspective, we are trying to standardise continous delivery process for our serverless components. At the moment what we have is "poor man's CI/CD" - some bash/node scripts which use AWS sdk's CloudFormation api to provision resources. There are varioius tools available either from AWS or serverless community such as [Terraform](https://www.terraform.io/), [CodePipeline](https://aws.amazon.com/documentation/codepipeline/) we are trying to integrate to provide a frictionless process to production.
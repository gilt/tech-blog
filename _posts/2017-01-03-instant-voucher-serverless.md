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

The new instant order pipeline starts with **order-service** publishing a notification to an SNS topic whenever it creates an order object. An order notification contains essential order properties such as order_id, user_guid, unit_id etc to allow event subscribers looking up the order object in orders key-value store. An AWS Lambda application **order-notification-dispatcher** subscribes to this SNS topic and kicks off the processing by invoking an AWS Step Function resource. See below a simplified architecture diagram of the order processing system.

The architecture leverages Lambda and Step Function from AWS Serverless suite to build several key components. At Gilt, different teams have started embracing serverless paradigm to build production applications. There are many benefits from adoption of serverless paradigm, such as abstraction from infrastructure, out of box scalability, on-demand cost model etc just to name a few. Comparing to the alternative of building and maintaining an array of EC2/container instances, serverless architecture takes a step further from microservices to allow even faster iteration cycle within SDLC. With the use of Step Function as orchestrating engine, it is mucher easier to facilitate interaction between Lambda applications. 

![alt text](https://i.imgur.com/6QM1pHi.png "Instant Order Processing Architecture")


# AWS Step Function for Lambda Orchestration

As mentioned above, AWS Step Function is an orchestrating service which makes it easy to coordinate stateless Lambda applications by establishing a specification to transition application states. Behind the scene it is depicted as a state machine constructed with JSON based [Amazon States Language](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html). See below a sample execution from order-processing step function.

![alt text](https://i.imgur.com/xROzpZV.png "An successful Step Function execution example")

### Inside Step Function

At the top level the specification include various types of [States](https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-states.html) such as Task, Choice, Wait to be used to compose simple business logic to transition application state. Inside a Task state, an AWS Lambda ARN can be specified to be executed as task. The output of the Lambda will be directed as input to next State. This is some sample json spec from the order-processing state machine:

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
      "Result": "This is ending state for fraud order",
      "End": true
    }
    ...
  }
}
```

### Polling and Retry on Errors

Serverless (or FaaS) paradigm fits really well on the scenarios that computing completes within short time (ideally seconds). However sometimes we still need to run slightly longer computing or async tasks. For example in our pipeline we need to keep polling a service endpoint for fraud scan result since it is an async process. We implement it by defining a retry counter *get_fraud_status_retries* within a Choice state and set a max attempt count of 60 to terminate retries.

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

Also it is critical to make cloud applications resilient to errors such as networking and timeout. Step Function provides error handling to allow catching/retrying some predefined errors as well as customised Lamdba error types. You can specify different retry strategies with properties such as *MaxAttempts* and *BackoffRate*. See below example that we implement retrying for different errors in the Task state to create redemption code:

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

Deploying a mission critical service to production environment is always a nervous process. At Gilt we advocate immutable deployment whenever possible and leverage A/B test to help us roll out new features to customers in a gradual manner. In serverless world it is a little different since most of the infrastructure management is abstracted away but on the other side it could be simpler. 

### Lambda Versioning
AWS Lambda's [versioning](https://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html) feature provides the ability to make Lambda function immutable by publishing a version (snapshot) of the application. We really like this since it ensures the Lambda application artifact as well as environment variables remain untouchable once published. Note that in the above code snippets of state machine json, the ARN specified for each Lambda resource is Lambda version ARN instead of function ARN. We also use Lambda's [aliasing](https://docs.aws.amazon.com/lambda/latest/dg/aliases-intro.html) feature to have a **prod** alias mapping to current production version, with immutable environment variables:

![alt text](https://i.imgur.com/Rj7UeTy.png "Lambda Alias Mapping")

With aliasing we can easily roll back to previous Lambda version in case of unexpected production failure.

### Blue/Green Stacks

So we have immutable Lambda functions, but we still want to make our Step Functions immutable. We decide to create new Step Function resource every time we release it, meanwhile the old SF resource remains unchanged. Since AWS does not provide versioning feature for Step Function, we include semantic versioning in the Step Function name e.g. order-processing-v0.0.6. With both new and old versions (including historical SFs) we are able to apply blue/green deployment and rollback procedure. 

To route orders to either blue/green stack, we make the **order-notification-dispatcher** Lambda the de facto router by providing blue/green versions of SF as its [environment variables](https://docs.aws.amazon.com/lambda/latest/dg/env_variables.html). Here is the Node.js codes to read stack environment variables:
```javascript
const stateMachineBlueVer = process.env.STATE_MACHINE_BLUE_VER;
const stateMachineGreenVer = process.env.STATE_MACHINE_GREEN_VER;
```

With fetched state machine stack version we can compose Step Function ARN with predefined format, then start a new execution with AWS sdk Step Function api:
```javascript
function dispatch(orderJson) {
  const orderId = orderJson.order_id;
  const stateMachine = preProcessingStepFunctionPrefix + orderJson.state_machine_version; 
  const params = {
    stateMachineArn: stateMachine,
    name: orderId.toString(),
    input: JSON.stringify(orderJson)
  };  
  return new AWS.StepFunctions().startExecution(params).promise();
}
```


### Partial Rollout

We make **order-notification-dispatcher** query our a/b test engine to have simple routing logic for each order notification, so that it can shift traffic to either blue/green Step Function stack according to test/control group the order falls into. Also note that AWS recently released a nice [traffic shifting](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html) feature for Lambda application. Here we didn't use it as our a/b test engine provides finer-granular control which can target to certain group such as Gilt's internal employees. Here is a diagram depicting the partial rollout process for new Step Function resources:

![alt text](https://i.imgur.com/pT48c3C.png "Partial Rollout Process")

# Conclusion

### What We Have Achieved

As of today all of Gilt City's orders have been directed to instant processing pipeline, which shortens the majority orders' processing time from over 15 minutes to within seconds. We are looking to expand the system to take over more workload including sales items, so to bring the instant order user experience to wider customer base.

### Step Function Limitations

From our development exerience using AWS Step Function we discover some limitations of this service.

First of all it lacks of a feature like 'Map' state which ideally can take a list of input objects and transform it to another list of result objects. In our case, an order object can 'spawn' a list of orders depending on the items it include in. Unfortuntely SF does not offer a State type that can map a dynamic number of elements. We eventually make the workaround by creating a **order-pre-processing** Step Function and make it call **order-processing** Step Function multiple times to process those 'spawned' orders.

Secondly we hope AWS can provide versioning/aliasing for Step Function so we can gain immutability out of the box instead of forcing immutability on our side. Any support for blue/green deployment would be even better.

Also we expect AWS to provide better filtering/searching abilities on Step Function dashboard so we can gain some fundamental data analytics from historical executions.

### Future Work
From architecture perspective, we are trying to standardise continous delivery process for our serverless components. At the moment what we have is "poor man's CI/CD" - some bash/node scripts which use AWS sdk's CloudFormation api to provision resources. There are varioius tools available either from AWS or serverless community such as [Terraform](https://www.terraform.io/), [CodePipeline](https://aws.amazon.com/documentation/codepipeline/) we are trying to integrate to provide a frictionless process to production.

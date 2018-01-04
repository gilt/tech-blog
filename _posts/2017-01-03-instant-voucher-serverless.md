---
layout: post
title: "Revitalise Gilt City's Order Processing with Serverless Architecture"
author: Liyu Ma
date: '2017-01-13'
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

[Gilt City](https://www.gilt.com/city/) is Gilt's high-end voucher portal that offers localised discounts on exclusive lifestyle experiences in dining, entertainment, beauty, fitness etc to our 3.4 million members across 13 U.S. cities. Gilt City's legacy order processing backend is a scheduled-job based architecture that various functionality such as fraud scan, payment authorisation, order fulfilment are assigned to independent jobs that process orders in batch. Though this architecture can scale to meet peak time workload and provides some level of resilience (failed orders are retried next time job runs), it inevitably includes some idle time i.e. wait for next job to pick up order from previous job. The resulting average processing time could add up to 15~30 minutes. 

Since many of Gilt City’s offers are of impulsive nature and time sensitive, long processing time becomes a clear bottleneck to user experience and feature development. We believe that by reducing this wait time, it will significantly boost overall shopping experience - imagine that after placing an order users can receive their voucher instantly and are more likely to use it soon after.
  

# An Event Driven, Serverless Architecture

It is never easy to rewrite (or replace) a mission critical system. In our case, we have to keep existing monolithic ruby & rails app running while spinning up new pipeline. We took the strangler pattern (see this [Martin Fowler’s article] for strangler concept) and built a new per-order-processing api layer around existing batch-processing, job-based system in the same r&r app. While at the mean time the legacy job-based system acts as a good fallback to allow retrying processing a failed order from instant pipeline.

The new instant order pipeline starts with order-service publishing a notification to an SNS topic whenever it creates an order object. An order notification includes essential order properties such as order_id, user_guid, unit_id etc to allow event subscribers look up the order object in key-value store. An AWS Lambda application order-notification-dispatcher subscribes to this SNS topic and kicks off the processing by invoking an AWS Step Function resource. See below a simplified architecture diagram of the key components within the order processing system.

At Gilt, many teams have started embracing serverless paradigm to build production applications. There are many benefits from adoption of serverless paradigm, such as abstraction from infrastructure, out of box scalability, on-demand cost model etc just to name a few. Comparing to the alternative of building and maintaining an array of EC2/container instances, serverless architecture takes a step further from microservices to allow even faster iteration cycle within SDLC. With the use of Step Function as orchestrating engine, it is even easier to facilitate communication between Lambda applications. 


# Inside Step Function & Lambda

As mentioned above, AWS Step Function is an orchestrating service which makes it easy to coordinates stateless Lambda applications by establishing a specification to transition application states.


# Immutable Deployment & Partial Rollout

At Gilt we adopt ab-test approach actively which provides us the ability to gradually roll out new features to production. During the development stage we simply create a ab-test variant [city_orders_instant_processing] and make order-service query the variant value for each order request it receive. 

# 
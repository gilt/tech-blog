---
layout: post
title: "Sundial or AWS Batch, Why not both?"
author: Kevin O'Riordan
date: '2017-08-04'
categories: 'data'
tags:
- batch
- aws
- tech
- personalization
---

# Sundial on AWS Batch


About a year ago, we (the Gilt/HBC personalization team) open sourced Sundial (https://github.com/gilt/sundial) , a batch job orchestration system leveraging [Amazon EC2 Container Service](https://aws.amazon.com/ecs/).

We built Sundial to provide the following features on top of the standard ECS setup:

 - Streaming Logs (to Cloudwatch and S3 and live in Sundial UI)
 - Metadata collection (through Graphite and displayed live in Sundial UI)
 - Dependency management between jobs
 - Retry strategies for failed jobs
 - Cron style scheduling for jobs
 - Email status reporting for jobs
 - Pagerduty integration for notifying team members about failing critical jobs

![alt text](http://i.imgur.com/RUZHLdI.png "Sundial DAG")

 Other solutions available at the time didn't suit our needs. Solutions we considered included [Chronos](https://mesos.github.io/chronos/) which lacked the features we needed and required a Mesos cluster, and [Airbnb Airflow](http://airbnb.io/projects/airflow/), which was immature at the time.

 At the time, we chose ECS because we hoped to take advantages of AWS features such as autoscaling in order to save costs
 by scaling the cluster up and down by demand. In practice, this required too much manual effort and moving parts so we lived with a long running cluster
 scaled to handle peak load.

 Since then, our needs have grown and we have jobs ranging in size from a couple of hundred MB of memory to 60GB of memory. Having a cluster scaled
 to handle peak load with all these job sizes had become too expensive. Most job failure noise has been due to cluster resources not being available or smaller jobs taking up space on instances meant to be dedicated to bigger jobs. (ECS is weak when it comes to task placement strategies).

 Thankfully AWS have come along with their own enhancements on top of ECS in the form of [AWS Batch](https://aws.amazon.com/batch/).


### What we love about Batch

  - Managed compute environment. This means AWS handles scaling up and down the cluster in response to workload.
  - Heterogenous instance types (useful when we have outlier jobs taking large amounts of CPU/memory resources)
  - Spot instances (save over half on on-demand instance costs)
  - Easy integration with Cloudwatch Logs (stdout and stderr captured automatically)

### What sucks

  - Not being able to run "linked" containers (We relied on this for metadata service and log upload to S3)
  - Needing a custom AMI to configure extra disk space on the instances.

### What we'd love for Batch to do better
  - Make disk space on managed instances configurable.
   Currently the workaround is to create a custom AMI with the disk space you need if you have jobs that store a lot of data on disk (Not uncommon in a data processing environment). 
   Gilt has a feature request open with Amazon on this issue.


### Why not dump Sundial in favour of using Batch directly?

Sundial still provides features that Batch doesn't provide:
 - Email reporting
 - Pagerduty integration
 - Easy transition, processes can be a mixed workload of jobs running on ECS and Batch.
 - Configurable backoff strategy for job retries.
 - Time limits for jobs. If a job hangs, we can kill and retry after a certain period of time
 - Nice dashboard of processes (At a glance see what's green and what's red)

 ![alt text](http://i.imgur.com/PAeqBJH.png "Sundial dashboard")

 Sure enough, some of the above can be configured through hooking up lambdas/SNS messages etc. but Sundial gives it to you out of the box.

 ### What next?

 Sundial with AWS Batch backend now works great for the use cases we encounter doing personalization. We may consider enhancements such as Prometheus push gateway integration (to replace the Graphite service we had with ECS and to keep track of metrics over time) and UI enhancements to Sundial. 

In the long term we may consider other open source solutions as maintaining a job system counts as technical debt that
 is a distraction from product focused tasks. The HBC data team, who have very similar requirements to us, have started adopting Airflow (by Airbnb). As part of their adoption, they have contributed to an open source effort to make Airflow support Batch as a backend. If it works well for them, this is a solution we may adopt in the future.

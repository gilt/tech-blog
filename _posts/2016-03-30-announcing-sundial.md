---
layout: post
title: Sundial Job Scheduler Open Source Release
author: Kevin O'Riordan
date: '2016-03-30'
categories: 'aws'
tags:
- aws
- ecs
- batch
- jobs
- scheduling
---

# Announcing Sundial

Gilt Tech is proud to announce the open source release of Sundial, Gilt’s batch job scheduler for Amazon ECS.

Sundial is the outcome of work by Gilt’s Personalization team to build a better platform on which to do batch processing workloads. 

## History

At the start of 2015, the Personalization team was dependent on a job system designed for running Ruby jobs and hacked to run Java/Scala jobs through JVM calls wrapped in Ruby scripts.

Problems with running on this system included:

* Lack of dependency management between jobs: This meant jobs that depended on other jobs had to be merged into large monolithic jobs that often took hours to run. Failure meant restarting the entire job.
* Lack of visibility into jobs.
* Poor isolation between jobs.
* Uploading new jobs was an unpleasant task

After Gilt moved this job system to the AWS cloud in 2015, poor isolation between jobs in particular started to cause major headaches. Especially as the system was intended to handle critical backoffice tasks and not run CPU/memory intensive machine learning applications.

## What is Sundial?

Sundial is a Play framework application written in Scala and leveraging AWS EC2 Container Service to run batch applications in a clustered environment in a similar fashion to Chronos on Mesos.

## Feature Overview

### Dependency management between jobs

![Jobs graph screenshot](http://imgur.com/gtxLv9f.gif)

Sundial jobs consist of high level "processes" made up of tasks with dependencies between tasks. Tasks start running as soon as all the tasks they depend on complete. 

### Streaming Cloudwatch Logs viewer

Simply tell Sundial the location of your application logs within your Docker container and Sundial will stream those logs to Cloudwatch and also expose them through a live viewer in the Sundial UI.

![Live logs](http://imgur.com/WIX5w5a.gif)

### Saved logs

When job completes, docker inspect output, docker logs (stdout/stderr) output and any application logs you configure to collect are collected and uploaded to S3. These can also be viewed through Sundial UI so you don't need to hunt in S3 for them.

![Saved logs link](http://i.imgur.com/GhdO4Ph.png)
![Saved logs](http://i.imgur.com/n6Hawo8.png)

### Configurable Retries for failed tasks

No need to restart entire process if individual tasks fail

![Retries](http://imgur.com/DLlCg0C.gif)

### Job metadata

Sundial exposes a Graphite metadata server to running jobs. Metadata published to Graphite shows in Sundial UI as job runs.

![Metadata](http://i.imgur.com/KJwJihF.png)

### Process History viewer

![Process history](http://i.imgur.com/J8ZEPmb.png)

"Sun" icons illustrate success/failure of past processes and also relative duration of each process run.

### Duration limit on tasks

Tasks can be configured with maximum runtime so tasks that hang are automatically killed and optionally retried.

## Alternatives evaluated

### Jenkins pipelines

Lacks native Docker support. Lot of manual work to setup pipelines.

### Airflow by Airbnb

This has some compelling features but wasn’t available when the team started building Sundial. 

### Singularity by Hubspot

Has some job scheduling capabilities but requires Mesos infrastructure. Also job scheduling is second class citizen to deploying long running services.


### Chronos

Has some features in common with Sundial such as dependency management between jobs and the ability to run native Docker jobs and shell scripts but lacks some nice features such as visibility into running jobs, managing logs and metadata. Also Chronos requires setting up and maintaining Mesos cluster and its associated dependencies. Sundial only relies on AWS managed solutions.


## Current state of adoption

Sundial has been adopted first by its authors Team Cerebro (Personalization algorithms team) and by Team Ouroboros (Front end personalization). Team Stream is currently evaluating Sundial for Reactive Search.

Sundial is also being evaluated by London/Ukraine startup Movedin.co and we are grateful for the PR submissions they have contributed back.


---
layout: post
title: ION-Roller - Immutable software deployment service for AWS
author: Natalia Bartol
date: '2015-09-16'
categories: 
- aws
tags:
- Gary Coady
- Natalia Bartol
- aws
- docker
- deployment
redirect_to:
- https://tech.hbc.com/2015-09-16-ion-roller-immutable-software-deployment-service-for-aws.html
---

Gilt has been at the forefront of the wave of microservice architecture. With the advantage of many individual services that do one thing well comes increased complexity of service management.

Our previous system was based on a reasonably traditional model of deployment scripts that simply replaced software on machines in order, and performed health checks before proceeding to the next server. A number of issues caused friction in attempts to release software. One was that in spite of services being run as microservices, many deployment decisions had to be done in lockstep, due to the shared platform. Another was that services that took a long time to start up (cache loads, etc.) had a large cost when the service was stopped; if a new release had to be rolled back, this could take more time than people might like.

Two ideas for software deployment arose from this. One was to separate the environments for each piece of software, and due to this, Gilt became an early leader in trials of the Docker deployment platform. Another idea was inspired by the principles of functional programming, where data was not changed in-place, but was modified by creating a new copy with the changes applied. This idea, “immutable infrastructure”, could allow new software releases, without the risk attached to shutting down the previous software version, as rollbacks would be quick and painless.

A third constraint appeared, which was not core to the concept, but based on the realities of Gilt’s deployment environments, which was that the AWS services, and EC2 computing platform, were going to be central to any service we created.

ION-Roller took these ideas, to create a deployment tool for immutable releases of software, using Docker environments, on top of the AWS infrastructure.

Following our [article about deploying microservices published in InfoQ](http://www.infoq.com/articles/gilt-deploying-microservices-aws), now we made our work publicly available: [https://github.com/gilt/ionroller](https://github.com/gilt/ionroller). Check out a short [demo](https://drive.google.com/file/d/0B4LFRaB4aCbcRFRra0JOcUJnRVk/view?usp=sharing)!

Since development of the product started, Amazon has released a number of features in their own products (including the release of, and then enhancements to, the CodeDeploy service for deploying applications with EC2). In many cases, this is sufficient, especially for small companies which do not want to run their own deployment services. The major difference between the approaches is that CodeDeploy is not currently “immutable”, that is, it replaces the software as it installs new versions. We expect future changes to AWS services to further close the gap in functionality.

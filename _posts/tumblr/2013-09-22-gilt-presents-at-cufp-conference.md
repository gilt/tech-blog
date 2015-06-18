---
layout: post
title: Gilt Presents at CUFP Conference
date: '2013-09-22T11:04:00-04:00'
tags:
- CUFP
- Commercial Users of Functional Programming
- conferences
- Kevin Scaldeferri
- functional programming
- Scala
- sbt
- micro-services
tumblr_url: http://tech.gilt.com/post/61962068534/gilt-presents-at-cufp-conference
---


Gilt Principal Engineer Kevin Scaldeferri is one of the featured presenters at this week’s Commercial Users of Functional Programming (CUFP) conference in Boston. Kevin’s talk focuses on the evolution of Gilt’s production architecture from a single monolithic web application to a highly-distributed collection of more than 200 micro-services and small web applications. As Kevin writes: “this architectural shift allows greater scalability and faster, less coupled development of new features, but also presents challenges around maintaining consistent development, testing, and deployment processes.”
Kevin’s presentation focuses some of the interesting and novel ways we use Scala to address these challenges and implement new features, including:
Creating an SBT uber-plugin to abstract and unify the development process with testing, deployment, and operations
Using the cake pattern to bridge the divide between unit testing and functional testing
Type-safe shared configuration using Zookeeper
Live inventory updates using Play WebSockets and Akka Actors

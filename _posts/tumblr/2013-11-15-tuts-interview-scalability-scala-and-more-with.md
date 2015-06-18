---
layout: post
title: 'Tuts+ Interview: Scalability, Scala and More with Gilt''s Eric Bowman'
date: '2013-11-15T11:47:33-05:00'
tags:
- Eric Bowman
- Architecture
- Scala
- scalability
- gilt
- gilttech
tumblr_url: http://tech.gilt.com/post/67066077185/tuts-interview-scalability-scala-and-more-with
---


The popular tech website Tuts+ just published an informative Q&A with Gilt VP Architecture Eric Bowman. An excerpt:


Q Could you set an expectation for our readers of the scale/size of Gilt.com so they get a better feel for the breadth of effort needed to build a large-scale site?



Eric: The flash sales model presents a unique technical challenge because so much of the traffic comes in these incredible pulses as new sales go live. Over the course of a few seconds, our traffic can increase by as much as 100x, which really puts stress on every part of the system, all at once. Essentially, we need to have the eCommerce infrastructure almost at Amazon scale for at least 15 minutes every day. Most days this happens exactly at noon EST, and until a couple of years ago, noon was a stressful time every day. Nowadays it’s usually a non-event–in part because our software is great, and in other part due to better visibility into system performance and behavior.
In order to accommodate the pulse, we tend to over-provision on the hardware side. Our customer-facing production environment at the moment consists of about 40 physical servers running a couple hundred micro-services and a few dozen user-facing applications. On top of that we have about another 100 servers for development, testing, data warehousing, analytics and development infrastructure.

Read the full interview here!

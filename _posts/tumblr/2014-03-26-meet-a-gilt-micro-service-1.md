---
layout: post
title: 'Meet a Gilt Micro-Service #1: svc-inventory-request'
date: '2014-03-26T12:13:00-04:00'
tags:
- Gilt
- Gilt Tech
- Gilt Groupe
- micro-services
- Robert Brazier
- svc-inventory-request
- Scala
- Typesafe
- Scala 2.10.3
- Back Office
- Slick
- JSON
- software engineering
- case classes
- ActiveRecord
- microservices
tumblr_url: http://tech.gilt.com/post/80785545576/meet-a-gilt-micro-service-1
---

svc-inventory-request helps us handle our modelling photography
Hi, everyone! This is the start of a (hopefully) regular series in which we take a closer look at Gilt micro-services: the hundreds of services that together make up our distributed, Scala-built micro-services architecture. For each installment, I’ll pull a random repo from Gerrit and interview a Gilt technologist about the relevant micro-service. Together we’ll learn more about what micro-services are and what they do, and uncover some of the funny and interesting histories behind some of the code we’ve written over the years.
First up for review is svc-inventory-request: an inventory-related microservice created by Gilt Software Engineer, Back Office team member and fancy-cheese aficionado Robert Brazier. Let’s get right to it!
What is svc-inventory-request, and what does it do?svc-inventory-request handles lists of fashion modeling shots and other miscellaneous pull requests for inventory. In part, it acts as a proxy to a second, distribution-oriented micro-service related to internal inventory transfers. “It seems to do so little, but there’s so much code for it,” Rob told us (with a sigh).
When was it born?The primary work began in May 2012 and lasted through that summer. It was the first Scala project that Rob worked on!
Any funny or interesting facts, cool power programmer moves or stupid code tricks?svc-inventory-request was one of the first times Rob crossed paths with Scala’s 22-parameter limit on case classes. While writing it, he discovered a Scala language bug! He submitted it to Typesafe and recently learned that it was fixed in 2.10.3.
Back in 2012, the Gilt Back Office team was still in Rails mode, and everyone knew about (and loved?) ActiveRecord. Rob asked around to see if a similar tool existed for Scala, but everyone warned him away from the ORM options available to him at the time. Rob wrote his own mini-ORM into svc-inventory-request! Similarly, there was still a lot of contention around how to handle JSON serialization/deserialization. Rob wrote that as well.  ”So much terrible,” Rob recalls. If he were to do it all over again, he’d use Slick: “It looks really nice for the database stuff.” 
What’s svc-inventory-request up to these days?Rob says it’s mostly in maintenance mode. The Back Office team is working on several new micro-services that will subsume a lot of svc-inventory-request’s workflow. Our PR team and other non-tech departments still use the micro-service fairly regularly, though.
Any last words?Rob: “Don’t write your own ORM.”
Stats:
First committer: Rob Brazier
Top committers: Rob Brazier, Kevin Hyland, Anthony Manfredi
Number of commits (as of March 2014): 196
That’s it for now! See you next time, when we take a look at lib-googledrive.

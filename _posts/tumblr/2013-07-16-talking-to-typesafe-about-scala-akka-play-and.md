---
layout: post
title: Talking to Typesafe About Scala, Akka, Play, and the Future of E-Commerce
date: '2013-07-16T17:30:00-04:00'
tags:
- scala
- akka
- playframework
- typesafe
- technology
- gilttech
- ecommerce
tumblr_url: http://tech.gilt.com/post/55632366264/talking-to-typesafe-about-scala-akka-play-and
---


Making the social media rounds today is Typesafe’s in-depth Q&A with members of the Gilt Tech team. Learn about the backend technologies we use, our motivations for migrating to the Typesafe platform, the potential role of Scala, Akka and Play in the evolution of ecommerce, and much more. A highlight:

Typesafe: How is the future of ecommerce evolving, and what role does Play, Akka and Scala have in addressing these shifts?
Gilt: The ecommerce business is extremely competitive on price, speed, and features. From a development point of view, maintaining velocity is important for keeping features flowing with minimum friction. Being able to reliably build the tooling we need to simplify our internal workflows is also important for the back office. Flash sales typically have incredible non-functional requirements. Our sale spikes tend to involve a two-orders-of-magnitude increase in traffic over the course of a few seconds – so much so, that we often refer to “requests per decisecond” instead of “requests per second” to drive home how quickly traffic can ramp up. The Typesafe Platform has scaled really well for us across our internal verticals, making it simple for us to build, for example, internal-facing workflows using the same tooling we use to build the highest-performance web pages.
By being early adopters of Play, we were able to move quickly and easily to a WebSocket architecture (via actor integration) that has led to a nice increase in conversion. We’re still evaluating Akka, but as we gain more experience with it, we see it becoming an integral tool. Akka enables asynchronous front-ends and offers a faster, more responsive, progressive web experience than what we would have been able to achieve with similar effort on other platforms. The actor model helps to break down functional units in code and maintain focus on the workflow. It also reduces friction for concurrent programming by eliminating boilerplate code and the bugs that frequently come with it.
The Typesafe Platform enables us to move faster, build on what we have done, do less overall refactoring, and – we strongly believe – attract the best people.

Thanks to Typesafe for asking us such great questions!

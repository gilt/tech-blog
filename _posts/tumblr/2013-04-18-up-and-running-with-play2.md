---
layout: post
title: up and running with play2
date: '2013-04-18T17:02:54-04:00'
tags:
- PlayFramework
- Scala
- heroku
- "λ"
tumblr_url: http://tech.gilt.com/post/48301645551/up-and-running-with-play2
---
Up & Running with Play 2

Last night, Gilt hosted the second Play NYC meetup, after nearly a year since the first. This meetup was dedicated to introducing people to the Play Framework.

I gave a presentation that briefly touched on the reasons why Gilt chose the Play Framework for some of its recent projects and then jumped right into code. Over the course of the talk, I walked through constructing a Play app with Scala connecting to Gilt’s API. Starting with some functional tests, we covered:

routing, 
controllers, 
Play Actions, 
making a request to a web service,
Play’s configuration
Futures and asynchronous behavior, 
unmarshaling JSON,
Play’s templating language,
compiling Assets,
And finally, and most importantly, deploying our application to production (with Heroku). Along the way we touched on some tenets of functional programming1 and Scala’s powerful for comprehensions.  We covered a lot of ground and in the end only ended up with one route: listing active sales by store.

The slides for the talk are available on SpeakerDeck, the application built is currently running in production, and the application code is available on GitHub for anyone to fork and experiment on.

I had a blast. Our next meetup isn’t scheduled yet, but we definitely won’t allow such a long delay between meetups again. Join the group to be the first to hear about upcoming events. Thank you to everybody who came out. I am looking forward to the next one.

– Mark



“What’s a monad?” ↩

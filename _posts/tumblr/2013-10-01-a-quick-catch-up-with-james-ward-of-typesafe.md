---
layout: post
title: A Quick Catch-up With James Ward of Typesafe
date: '2013-10-01T17:10:00-04:00'
tags:
- James Ward
- Typesafe
- WebSockets
- Scala
- Akka
- Play Framework
- Reactive applications
- Java
- REST
- JavaOne
- video
- NYC
tumblr_url: http://tech.gilt.com/post/62838442334/a-quick-catch-up-with-james-ward-of-typesafe
---
Next week Typesafe Developer Advocate James Ward will present (at least) three talks in New York City: “Diving Into Play Framework’s Deep End” (10/8 at Amplify); “Building Reactive Apps” (hosted by NYJavaSIG on 10/9 at Credit Suisse) and “Intro to Play Framework” (hosted by NY-Scala on 10/10 at Meetup). James was kind enough to take a few moments to answer some questions for us.
Gilt: How did you come to work at Typesafe? What attracted you to your current role?
James Ward: I started using Play Framework a few years ago and was very impressed with how powerful and yet simple it is. One year ago the opportunity arose to become a Developer Advocate at Typesafe and I couldn’t resist.  Since then I’ve been learning more about Akka and Scala and see many similarities with Play. Akka provides a simple abstraction for concurrent systems, and Scala is a very powerful language where my code becomes more concise and readable the more I learn about it.  It is a ton of fun to evangelize technologies that developers love!
G: In your “A Java Developer’s Primer to the Typesafe Platform” talk, what are the key things you try to emphasize? What is the response from developers? 
JW: Lately I’ve been talking about building Reactive applications. Recently the Reactive Manifesto was published to coalesce some of the emerging patterns in software development. Java developers are always pleasantly surprised by the power and simplicity of building Reactive applications with the Typesafe Platform: Play Framework, Akka, and Scala/Java.
G: How would you explain to a newbie the differences between Play and other frameworks, highlighting Play’s advantages?
JW: Play Framework does a great job of getting out of the way so that I can easily implement RESTful JSON services or use abstractions to build complex Single Page Apps. One of the best parts of Play is its developer friendliness. The “just hit refresh” workflow supports a high-velocity development experience while still using type-safe languages. Play also includes native support for modern APIs like WebSockets, and tools like CoffeeScript and LESS asset compilers.
G: Could you talk a bit about WebSockets and actor integration, and offer some tips or best practices?
JW: Modern web applications often need to react in real-time to events and changing data. This requires a scalable way to push data from the server to the client. WebSockets offer a great way to do that. The WebSocket is just a channel, so when combined with an Akka Actor, applications have a great way to build event-driven applications that extend all the way out to the client.
G: Could you provide any tips for handling JSON in Play 2.1? Of all the available options–transformers, macro inception, combinators, JsResult–what’s the best to pursue?
JW: Typical JSON APIs are pretty basic, as they are primarily meant for serializing and deserializing data. Play’s Scala JSON API goes way beyond typical data marshaling, enabling developers to do powerful transformation and validation of JSON data. One of the coolest examples of this is called “JSON Coast to Coast,” where data is stored in a JSON data-store, possibly composed together with JSON from other datasources, transformed, and sent to the client using a Reactive (async + non-blocking) connection. Depending on the architecture, the actual tools may vary–but Play’s Scala JSON API provides a giant toolbox to pull from.
G: What are some of your favorite uses of Play–your own, and those of other developers?
JW: I use Play for all of my apps now.  But my favorite (and typical) use is for Single Page Applications that expose JSON on the back-end and have a JavaScript front-end.
G: What will Play 3.0 look like?
JW: Good question!  I’m not sure yet.  At this point we’ve only thought through Play 2.3 and are in more of an incremental mode for the time-being. (The Roadmap is public.) We have some big ideas we are brainstorming for 3.0, but there isn’t anything firm yet.
Thanks, James! For more of his perspective, you might want to watch this interview he did with JavaOne in late August:

---
layout: post
title: The Talks From Last Weekend's Pacific Northwest Scala Conference
date: '2013-10-23T11:55:00-04:00'
tags:
- PNWScala
- Pacific Northwest Scala Conference
- Evan Chan
- Stephen Judkins
- Brendan McAdams
- Sam Ritchie
- Akka
- Scala
- technology
- conferences
- slideshow
- Twitter
- Hadoop
- Summingbird
- Erik Osheim
- Clint Tseng
- Kelsey Gilmore-Innis
- Tom Switzer
- Thomas Lockney
- Charles Francis
- Paul Phillips
tumblr_url: http://tech.gilt.com/post/64871268830/the-talks-from-last-weekends-pacific-northwest
---
Over the weekend Portland, Ore. played host to the first-ever Pacific Northwest Scala Conference: two days of presentations, talks and open sessions. Sponsored in part by Gilt, and co-organized by Gilt Principal Software Engineer Kevin Scaldeferri, PNWScala featured an impressive roster of speakers from Twitter, Meetup, Typesafe, and other great companies. In addition to Saturday’s full menu of prepared talks, Sunday featured ad hoc, unconference-style sessions for people to suggest and present on topics of their choice (cool idea!).
“The community support and enthusiasm were beyond anything I expected,” says conference co-organizer Thomas Lockney. “I''m particularly excited to see what we can put together next year now that we know there’s more than sufficient interest in Scala in the Pacific Northwest.” So are we!
If you didn’t get to attend PNWScala, here are the featured presentations, plus introductory notes written by the presenters. Click the images to view the full slide presentations.
Paul Phillips, PNWScala keynote speaker and developer: “Keynote: We’re Doing It All Wrong”:

My conclusion after moving a million lines of code is that everything we do (plus or minus) is wrong. Henry Ford said “If I had asked people what they wanted, they would have said faster horses.” Our horses are now a billion times faster: our horses may well be the fastest in the galaxy. Are we too comfortable on our horses? Would we recognize better mounts if they came along, but didn’t look like horses? Is the state of our profession one which warrants pride, shame, or despair? I will explore these questions with unwarranted optimism.

 

Tom Switzer, “Spire by Example”:

This talk will introduce Spire by solving a fairly simple optimization problem. We’ll first prototype a machine learning algorithm, using Spire’s type classes and operators to create generic, concise and readable code. With this in hand, we’ll then explore possible solutions to some real problems that arise in our data using some of Spire’s data types, like real numbers, polynomials and random distributions. The goal is not to get into the nitty gritty details of Spire, but rather to showcase how Spire can be used to create nice, flexible numeric code.



Stephen Judkins, Portland-based Scala developer: Functional Raster Image Processing in Scala:

Most existing image processing libraries feature clumsy imperative interfaces to complicated mutable data structures. Here, we will show how raster graphics can be represented using simple functions and data structures and how a new library helps bridge the gap to real-world image formats. We’ll see how operations on raster graphics can be made simpler, faster, more memory-efficient, and more composable compared to existing alternatives. We’ll see both how common image processing tasks can be simple expressed, and examples of visually striking or fun effects that this framework makes easy.



Sam Ritchie, Clojure/Scala Developer at Twitter: “Twitter: Taking Hadoop Realtime with Summingbird”:

Twitter’s Summingbird library allows developers and data scientists to build massive streaming MapReduce pipelines without worrying about the usual mess of systems issues that come with realtime systems at scale. This talk will discuss the development of Summingbird’s hybrid Batch and Realtime operating mode, the power of clean, mathematical abstractions and the massive creative leverage that functional design constraints can give to a project.
The talk will also discuss some of the applications for these technologies currently being used at Twitter.



Brendan McAdams, Typesafe Professional Services: “Network I/O for a More Civilized Age: The New Akka I/O”:

Until recently, users seeking a way of doing Scalable I/O had two choices: NIO, which provides an esoteric interface requiring serious expertise and concurrency control, or Netty - which provides a rich and powerful layer above NIO. The downsides to Netty however include an extremely idiomatic Java API, and a series of separated threads and thread pools left out of the control of the user.
There is, however, hope for the Scala user who abhors free range threading and wants a more Scala-sane interface to a network. Working with the Spray (http://spray.io), the Akka team (http://Akka.io | http://letitcrash.com ) has recently introduced a new, lightweight Non-blockimg network I/O interface built around Akka’s core Actors.
This talk will explore the benefits and power of this new Akka I/O layer, including a brief exploration of its benefits over the “Old” Akka IO. The presenter will introduce the ByteString & it’s powerful manipulation tools for network traffic, the Pipeline system for composed protocol decoding, and much more. Further insights will include a demonstration of Akka I/O’s built in system for Backpressure — allowing true handling & awareness of an overloaded network buffer, and compositing of Futures on top of the Actor API to emulate a more functional interface.




Clint Tseng, UX designer: “Scala for Javascript Kiddies; Javascript for Scala Nerds”:

In this talk I describe how a quest to fulfill a government mandate for accessibility led to the development of a new interface framework based largely on Scala-like philosophies, and how one small monadic abstraction can change the entire face of a codebase. We will cover how Functional Reactive Programming can be usefully applied in a imperative-functional hybrid environment, and the upsides and downfalls of attempting to apply a very Scala-based mindset onto a fully dynamic language like Javascript. The work covered in this talk culminated in a framework called Janus (https://github.com/clint-tseng/janus), and while very young, the implications and influences behind it are very strong, and very much derived from my time learning and building Scala code.



Kelsey Gilmore-Innis, Scala engineer at Reverb Technologies: “Journey to the Heart of the For-Yield”:

Options and IOs and Iteratees, oh my! If you’ve poked around at Scala you’ve seen it–the ubiquitous for-comprehension sprinkled through idiomatic Scala code. As it turns out, what looks like a bit of syntactic sugar to ease prosaic list manipulation is actually a super powerful structure for abstracting away all kinds of common operations in a safe and maintainable way. It allows you to take full advantage of type safety and pushes the work of setting up boilerplate to the compiler. We’ll break down exactly what’s going on in a for-comprehension and explore some of the wild and wonderful structures that can be used within one. You’ll leave with a deeper understanding of the real-world benefits of functional programming.

 

Evan Chan, developer at Ooyala: Akka in Production: Our Story:

Everyone in the Scala world is using or looking into using Akka for low-latency, scalable, distributed or concurrent systems. We want to share our story of developing and productionizing multiple Akka apps, including low-latency ingestion and real-time processing systems, and Spark-based applications.
When does one use actors vs futures?
Why did we go with Logback instead of Akka’s built-in logging?
Can we use Akka with, or in place of, Storm?
How did we set up instrumentation and monitoring in production?
How does one use VisualVM to debug Akka apps in production?
What happens if the mailbox gets full?
What is our Akka stack like?
We will share best practices that we’ve discovered when building Akka and Scala apps, pitfalls and things we’d like to avoid, and a vision of where we would like to go for ideal Akka monitoring, instrumentation, and debugging facilities.


 

Erik Osheim, engineer at Meetup: “Inlining Anonymous Functions With Macros”:


The inlining problem (described by Cliff Click) is something that affects all functional languages on the JVM. The basic idea is that tight-loops dispatching to an anonymous function can defeat all of the JVMs optimization strategies. This creates a natural tension between writing the most concise code possible (DRY) and “manually inlining” boilerplate code for performance reasons.
Macros give us one possible tool to solve this problem. This talk describes a strategy where we can use anonymous function literals to generate implementations at compile-time. This strategy has the potential to give us terse, high-level source code that compiles to fast bytecode. In this talk, we’ll see some early efforts, as well as challenges.



Charles Francis, Pellucid Analytics: “The State of Scala as a Platform for Statistical Computing”:

I first started using Scala in the context of a mostly Python project visualizing and building models of a pretty massive textual dataset. My first frustration with the language was accordingly how much work it was just to parse a CSV file (don’t even get me started on memory usage back in 2.6…)! Then, of course, there was an absolute absence of any idiomatic Scala libraries for statistical and numerical processing—one was left to the terrible inconsistencies of Java’s numeric types. Of course the situation has improved in recent years as evidenced by very high quality libraries meant to aid this type of workflow like Saddle, Spire, Breeze, and Scala Notebook. While Scala has experienced quite a lot of success as a language for doing Hadoop-style data processing, in this talk I want to focus instead on the current state of the language as a general statistical platform—less big data than analysts working with in-memory datasets for high-performance analytics and visualization. I will focus on how libraries like the ones mentioned above work together (or don’t) and how Scala competes with the dominant languages in this space, R and Python. I intend to illustrate a simple analytics workflow using these tools, showing what works well, problems one will come up against, and indicate some fruitful lines for future work and unification.




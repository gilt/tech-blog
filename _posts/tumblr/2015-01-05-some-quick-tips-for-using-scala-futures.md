---
layout: post
title: Some Quick Tips for Using Scala Futures
date: '2015-01-05T13:27:00-05:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- John Kenny
- Scala
- Scala Futures
- software engineering
- how-to
- Guava ListenableFutures
- futures
- blocking
- APIs
- reactive applications
- ".get()"
- Await API
- Play Framework
tumblr_url: http://tech.gilt.com/post/107232340014/some-quick-tips-for-using-scala-futures
---

The Gilt engineering team has been transitioning to the latest version of our in-house library–a move that involves migrating from Guava ListenableFutures to Scala Futures. Futures are a key building block of reactive applications, and offer a really nice API for writing fast, efficient, non-blocking code. However, using them requires some skills that are a bit outside the scope of “traditional” programming. 
For all of you who are new to Scala, or not-so-new but unfamiliar with futures, I thought it was worth sharing some thoughts on important things to watch out for when working with them.
Your code should be non-blocking
The easy .get() option, which is available on ListenableFuture, is not available on Scala Future. Instead, you are required to use the deliberately less elegant Await API. This is actually a good thing, as it gives you plenty of time to reconsider the fact that you’re blocking, while you’re typing it out :) Blocking is strongly discouraged, as it defeats the whole purpose of futures–and there is almost always a better, more efficient way to write the code in a non-blocking way.
Having said all that, there may be times when you have no choice but to block. If you find yourself in this situation, you need to think carefully about which threads you are holding onto while you are blocking. For example, if you’re writing a Play application and decide to block the main request thread, then your application will very quickly run out of threads, and throughput will slow to a trickle. This is because the thread you are blocking on is from a very small thread pool that Play makes available for handling incoming requests.
One case where blocking may be acceptable, or even desired, is a background thread–perhaps one that is refreshing a cache. In this case, you can create a fixed-size thread pool for handling the cache refresh and block on this. Since the use of the thread pool is isolated, there is no harm holding onto threads while you wait for a Future to resolve.
Which execution context you use matters
More and more APIs require an execution context to be passed either implicitly or explicitly. For example, the Scala Future.onComplete function is defined as:
def onComplete[U](f: Try[T] => U)(implicit executor: ExecutionContext): Unit
The callback function (f) is executed on a thread from the passed-in execution context. It’s very important to consider what type of operations are executed in f.
For CPU-bound (i.e. non-blocking) operations, you can follow the guidance of the Scala compiler error that you get when you forget to provide the context–namely, importing scala.concurrent.ExecutionContext.Implicits.global. Alternatively, it may be desirable to use a “same thread” execution context.–i.e., the callback executes on the same thread that completes the Future, rather than forcing a hand-off to another thread.
For I/O-bound (i.e. blocking) operations, you should consider providing a different context. The global context by default has only N threads, where N is the number of processors available to the JVM. If you call Await.result on one of the global execution context threads, it will create another thread to compensate. (Its main goal in life is to keep the CPU busy–check out this post for more info.) However, if you’re doing a lot of blocking it’s better to create your own context with an appropriately-sized Executor and leave the global context available to everybody else for what it was intended for–small CPU-bound tasks.
What happens if a Future fails?
Futures will fail for a variety of reasons: timeouts calling a service, deserialization exceptions, etc. You need to think about what the behaviour should be when this happens. For comprehensions and the operators map, flatMap and foreach may be nice to use, but they can also lull you into a false sense of security. And since Scala doesn’t have checked exceptions, you won’t get any help from the compiler. Somebody is going to have to deal with the exception at some point. Luckily a Scala Future has really nice APIs like .recover, .recoverWith and .onFailure for handling exceptions and providing fallback behavior.
Futures are a really powerful tool for building fast, efficient, non-blocking applications. The APIs are elegant and simple to use. However, behind the simple APIs lies a world of complexity. It’s important to think carefully about how you are using futures and get a good understanding of the basic concepts behind them.

---
layout: post
title: Scala, Futures and "Lazy" Vals
date: '2015-01-22T18:23:00-05:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Andrey Kartashov
- Scala
- lazy vals
- ForkJoinPool
- Jessica Kerr
- FJP
- Scala 2.10
tumblr_url: http://tech.gilt.com/post/108863944789/scala-futures-and-lazy-vals
---

Image via H. Michael Karshis. 
When implementing “lazy val” class variables in Scala 2.10, keep in mind that lazy vals hide some plain-old synchronized block behind a nice-looking syntax. At Gilt, more and more of our stuff is Future-based, and increasingly more of it executes in Scala’s shared ForkJoinPool under the assumption that it “behaves.” Sometimes these worlds collide, however, and “lazy val”-guarded calls (which are synchronized blocks in disguise) end up being thrown into global FJP. And worse, they may some times be highly-contended.
There are good reasons to use Futures and async IO, and good reasons to use lazy vals. You just need to be very, very careful if and when you end up mixing the two, because they are a bit tricky to understand at best and may lock up your system at worst. Of course, the easy position to take is, “ just don’t do it! ”:)  The rule of thumb: If code that initializes your lazy val is non-blocking and very fast, it’s most likely OK and could be good way to defer creation of heavy objects (like thread pools). OTOH, if your lazy val is initialized from a Future, or the result of some remote service call(s), that can easily turn out to be problematic when ‘normal’ code that tries to de-reference those values ends up (unwittingly) making a blocking call inside a (perhaps shared) FJP. Think twice if that’s where you find yourself–there are often better alternatives. –Content (and most words) by Andrey Kartashov, Gilt Principal Software Engineer

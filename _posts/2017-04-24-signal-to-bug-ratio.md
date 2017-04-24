---
layout: post
title: Signal to Bug Ratio
author: Andrew Powell
date: '2017-04-24'
categories: analytics
tags:
- 'bright-tag'
- events
- javascript
- marketing
- open source
- signal
- tagging
- tracking
---

*Preface: We work with Signal daily and are not promoting the product
 or service in any way.* [Signal](https://www.signal.co/) is a platform for
  implementing and managing tags and data for marketing, tracking, and affiliates.
  Debugging Signal events can be very problematic, exacerbated by a lack of tools,
  guidance on best practices, and engineering support.

## Oodles of Noise

Signal events are the de facto method for a client (a web page) to interact with
a signal implementation. Typically you bind an event to `window` and use some
JavaScript to trigger an event on `window` in the client. Sounds easy, yeah? If
you happen to work within an environment in which an engineering team doesn't
manage and test data being sent along with these events, debugging that `eventData`
can be far more difficult than it should be. There's a simple solution to debugging
`eventData` that introduces responsible patterns and easy of use, which go beyond
`console.log`.

## Knowledge Gap

I'd like to say right-off-the-bat that my intentions in this section are not to
belittle anyone at Signal, but rather raise the flag about related gaps in knowledge
within Signal's support team.

If you approach Signal about a tag implementation, an error with a tag, or pretty
much any in-product code need, you'll wind up talking with an "Implementation Consultant."
For most basic questions and implementation needs, these folks do a good job helping
out. However, **they are not [engineers](https://en.wikipedia.org/wiki/Software_engineer).** Rarely do we receive code from them, or
review code they've added to our Signal implementation, that would pass review
in any corner of our [engineering department](http://tech.gilt.com). Again, this is not to knock their
skill level - they aren't advertised as engineers. But it's important to understand
the distinction, and important to consult engineers for architectural needs and
best-practice guidance.

## The Console.log Conundrum

At one point in time, our Signal implementation went from being an engineering-first,
engineering-owned product, to a Marketing and Analytics owned product. With very
little JavaScript experience they were about to work within Signal. And those
teams did a fine job using Signal to drive the associated sites forward. However,
their guidance was coming from non-engineers as well, and at no fault of their own,
[many anti-patterns were implemented](https://sourcemaking.com/antipatterns). One
of the more egregious was the overuse of `console.log`.

Our Signal managing teams were advised to use `console.log` wherever they wanted
to view the value/content of `eventData` for each event that came through Signal.
That resulted in **_well over 200 instances_** of `console.log` sprinkled throughout
just one of five Dashboards. That's a hell of a lot of console noise for a single
page. Imagine engineers for the site trying to figure out where all the noise was
originating, having no knowledge of the Signal implementation nor what it was doing.
[Bananas](https://www.youtube.com/watch?v=s8MDNFaGfT4)!

## Simple Engineering Save

Since our implementation is not (yet!) engineering-owned, we can't run tests and
such on the data in a pre-production environment. Some would argue that Signal has
some pre-production ability, but even "Previewing" tags and events still runs live
in production. So we needed a method for our Marketing and Analytics teams to be
able to debug in a familiar way (which is unfortunately `console.log`) but in a
_controlled_ manner that doesn't affect the world.

<script src="https://gist.github.com/shellscape/fdcd98aa743b683eb4539336b06200c9.js"></script>

The idea is dead simple. Sprinkle `bananas.signal.debug(...)` all over, anywhere,
go bananas! It won't output to the console until explicitly enabled. That can be
done in two ways, but adding `?debug=true` to the URI and refreshing, or by calling
`bananas.signal.enable()` in the console before executing an action on the page
that will trigger a Signal event.

![debug output](http://shellscape.org/assets/images/in-post/signal-debug-output.png)

Only the debugging user will ever see the output.
Zero console pollution.

## Mind Bottling

> You know when things are so crazy it gets your thoughts all trapped, like in a bottle - [Blades of Glory](https://www.youtube.com/watch?v=rSfebOXSBOE)

Signal consultants suggested a few variants on the same theme but over all their
solutions were either too similar, or too confusing for the non-engineer custodians
of our Signal implementation. It's surprising that something similar and as simple
as this isn't already part of Signal's client library and available for folks
who are using the product without engineering support.

Please feel free to use the script above in your implementation. Or, if you have
a better solution, please comment!

### Cheers!

*Originally published at
 [shellscape.org](http://shellscape.org/2017/04/24/signal-to-debug-ratio) on
 April 24, 2017.*

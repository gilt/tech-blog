---
layout: post
title: '26/3/13: Today''s Noon Outage--and What We''re Doing to Make Sure This Never
  Happens Again.'
date: '2013-03-26T16:28:00-04:00'
tags:
- gilt
- gilttech
- code review
- LOSA
- Lots of Small Applications
tumblr_url: http://tech.gilt.com/post/46359463184/26-3-13-todays-noon-outage-and-what-were-doing
---
At Gilt we try to move as fast as we can getting code - be it fixes or awesome new features - to production as quickly and safely as possible. Sometimes we make mistakes, and, today was such a day. Around noon, a commit on one of our flagship applications ran riot: allocating native threads; consuming memory and CPU; and bringing down all other applications collocated on the same set of servers. Our customers were affected and for this the tech team at Gilt are truly sorry. There have been a ton of tweets from concerned members, and we were keen to explain what went wrong.

Some interesting things arose in the aftermath of this outage (we take all our outages very, very seriously). First and foremost, this was largely a people problem: our process around code-review and performance testing failed - a commit that was not fully peer-reviewed was moved to production, and deployed -after- our morning performance run. Under normal load, everything looked ‘just fine’ - under our noon rush, everything fell apart. I estimate there’s about a 60% chance that a good code-review would have caught the issue - however, I’m 99.999% confident that our rigorous load tests would have caught the issue. We use Gerrit for code review, and have automated load tests every morning; this was a late change for which we were hoping to gather some real life data related to load - ironically to debug a smaller performance issue we’ve been seeing in one of our applications - and we rushed the change.

A positive we can take out of this as a tech organization is that we already have a number of initiatives in progress at Gilt that will prevent this kind of thing from happening. The more we use code-review, the more we see opportunities to automate the veracity of any release: you can imagine a script that says “this release contains a commit that was not reviewed and was +2’d by the author - abort!”. From a performance perspective, we’re working on incorporating performance testing into a continuous integration system we call ‘ION Cannon’; again, any release would be performance tested and rolled back automatically. These are areas where we can take human error out of the process, and I know that I (as the engineer who didn’t run the load test) am keen that we double our efforts in this regard. 

One of the other things we’re doing is making all of the applications that run gilt.com smaller and more isolated, an initiative we call ‘LOSA’ (Lots of Small Apps). LOSA is the mantra that lets us break up some of our large web applications into smaller chunks. The outcome? Stronger ownership of each part of gilt.com by the engineering teams; simpler code, with better sharing of assets and commons functionality;  and, better isolation - in the event that one of our applications serving a part of gilt.com goes awry, other apps should not be impacted. 
Today we made a mistake - and we feel pretty bad about it. We feel good though about what we’re doing to make gilt.com better.

---
layout: post
title: 'A Few Things About Ping: a Play Framework Conference'
date: '2014-01-27T11:51:00-05:00'
tags:
- Gilt
- Gilttech
- Gilt Groupe
- Ping Conference
- Grant Klopper
- Matthias Nehlsen
- Pascal Voitot
- Julien Tourney
- James Roper
- Jim Brikman
- Sadek Drobi
- Christopher Hunt
- Typesafe
- Yann Simon
- conferences
- Play Framework
tumblr_url: http://tech.gilt.com/post/74733533436/a-few-things-about-ping-a-play-framework
---


On January 16 and 17 some of my colleagues and I were in Budapest, Hungary for the first-ever Ping conference: a two-day, “by the community, for the community” get-together for Play Framework users and enthusiasts. It was great! The standard of presentations was really, really high, and the content was extremely relevant to what we’re doing here at Gilt.
All the talks were recorded and are available here under “Schedule.” Some highlights about what you’ll find:

In his great keynote address, Play co-creator Sadek Drobi explains why Play Framework is designed the way it is, and why functions are awesome.
Typesafe Senior Engineer Christopher Hunt gives an overview of some new tools that will soon be available for managing an app’s JS/assets.
Leanovate Software Engineer Yann Simon gives the best presentation on the cake pattern I’ve ever seen. I still don’t like the cake pattern, though :).
LinkedIn Lead Developer (and recent Gilt guest) Yevgeniy (Jim) Brikman gave a brilliant presentation on how you can build a dynamic page by streaming the results of Promises to the browser as the content becomes available.
Typesafe Play Tech Lead James Roper explained some of the performance characteristics of a Play web app (especially around thread pools and different types of executors), all with benchmarks
Zengularity engineers Pascal Voitot and Julien Tournay gave two really entertaining (and mind melting!) presentations: one about typesafe JSON parsing in Play, and another about Scalaz Streams.
Hamburg-based engineer Matthias Nehlsen gave a front-end Scala talk–a bit of a rarity–on using Scala.js for writing non-DOM related, browser-side code in Scala.js and using it with Facebook’s React.js library. Scala.js is impressively/surprisingly problem-free, Matthias says, while Angular.js doesn’t work well with immutable data structures.
Grant Klopper from The Guardian gave a very interesting, funny talk about how the Guardian engineering team is using Play to create their new mobile site. Other tidbits: The Guardian has open-sourced their whole frontend(!); they are doing immutable deployments and continuous delivery (Grant deployed to production during the presentation!); and load-tested their new site using the existing site. If response times in a certain part of the fleet go over a threshold, the fleet is doubled automatically; if that doesn’t fix the issue a developer gets paged.


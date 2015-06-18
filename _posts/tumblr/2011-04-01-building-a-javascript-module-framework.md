---
layout: post
title: 'Presentation: Building a JavaScript Module Framework at Gilt'
date: '2011-04-01T10:04:00-04:00'
tags:
- javascript
- gilt
- gilttech
- Eric Shepherd
- slideshow
- video
- JavaScript module framework
- Brooklyn JavaScript Meetup
- presentations
- submission
tumblr_url: http://tech.gilt.com/post/4258162111/building-a-javascript-module-framework
---
Slides and video from Eric Shepherd’s presentation given at Gilt HQ and at the Brooklyn JavaScript Meetup:
Summary
For modules to function within a large-scale system and on third-party sites, they need to be self-contained units with minimal dependencies. They also need to keep their hands off of other modules and library code. Gilt’s module framework manages multiple independent components, providing them with what they need, and only what they need, to do their jobs.
Once the module framework is built, third parties still need an easy way to consume modules. A server-generated JavaScript bootstrap file allows all the module’s options to be wrapped in a closure, keeping the DOM clean and conflict-free. There are some complex problems that arise when embedding code this way, so be sure to watch for them!

Building a JavaScript Module Framework at Gilt from Gilt Tech on Vimeo.

Building a JavaScript Module Framework at Gilt
View more presentations from Eric Shepherd

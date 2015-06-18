---
layout: post
title: '"If You Love It So Much, Why Don''t You Write a Wrapper Around It?": jQCon
  Talk (Video)'
date: '2013-07-05T14:39:00-04:00'
tags:
- jquery
- jquery conference
- wrappers
- technology
- gilttech
- video
- API
- jqCon
- eric shepherd
- Eric Shepherd
- frontend
- jQuery Foundation
tumblr_url: http://tech.gilt.com/post/54688153654/if-you-love-it-so-much-why-dont-you-write-a
---

The jQuery Foundation just posted video of “If You Love It So Much, Why Don’t You Write a Wrapper Around It?”–my presentation at last month’s jQuery Conference in Portland, Ore. In my talk, I focus on the importance of using consistent APIs and taking advantage of other people’s work (in the form of third-party code) when working with a large code base. Putting a wrapper around someone else’s code can give you the API and feature set you want, while saving you tons of tedious work writing business logic.
The last time I attended jQCon was in 2010, when it was held in Boston. The conference is sponsored by jQuery, and certainly features a fair amount of jQuery-related content, but one of the things I appreciate most about it is its focus on larger-scale, front-end issues of the day. This year was no exception.
Back in 2010, two major themes that emerged during jQCon were pubsub messaging and client-side templating. At that time, Gilt was somewhat behind the curve in these areas. Our front-end team came back from the conference feeling inspired and energized, and built systems to handle both pubsub messaging and client-side templating. One was Gilt.Notify, an adaptation of Peter Higgins’ pubsub plugin. The other system was Gilt.Template, which at the time was a template-engine-agnostic wrapper around client-side templating (since different teams were using different template engines). Both of these systems have evolved over time, as we’ve normalized to one template engine (Handlebars) and added private pubsub channels that function like observers, but both are still part of our new module-based front-end stack.
In 2013, we find ourselves right in line with the current state of the industry. Featured talks covered HTML5 polyfills, CSS3 animations, front-end unit testing, client-side MVC, promises, A/B testing, client-side build tools, and—as the topic of my presentation illustrates—wrapping third-party plugins and libraries. Gilt has been working on all the above over the past couple years, and it was good to know that we’re up-to-date with the latest in front-end technology.
Check out the slides here. If your window is large enough, you’ll see at the bottom the notes I wrote to accompany the slides.

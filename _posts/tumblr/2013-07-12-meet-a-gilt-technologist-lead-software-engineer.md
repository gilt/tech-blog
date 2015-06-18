---
layout: post
title: 'Meet a Gilt Technologist: Lead Software Engineer John Kenny'
date: '2013-07-12T13:02:00-04:00'
tags:
- gilttech
- continuous delivery
- technology
- dublin
- backend
- Scala
- Handlebars
- Scandlebars
- Scalatest
- Solr
- Selenium
- John Kenny
tumblr_url: http://tech.gilt.com/post/55268716106/meet-a-gilt-technologist-lead-software-engineer
---

What is your role at Gilt?
I’m lead engineer for Team Galactus. (We like to give our teams abstract names that don’t refer to a particular initiative; at the time of forming Galactus, we were going through a comic book phase!) I’m a full-stack engineer, but the vast majority of my work at Gilt is on the backend: developing shared libraries, web applications and services.
How long have you been with Gilt?
Just over two years.
Has your role here changed over time?
No, I’ve always been a backend engineer. I’ve done some frontend stuff with previous companies that were very small, and where you had to roll up your sleeves and basically do everything.
Why do you enjoy backend development more than frontend?
It’s less like the Wild West than frontend development. You can implement clean, well-tested and reusable solutions fairly easily; it’s a lot more difficult to do that in the frontend. Frontend work often feels like one hack on top of another hack, with a third hack thrown in to work around some IE issue. And it all feels really fragile, because it’s not statically typed. Refactoring something can be a very stressful experience! There have been a few frameworks over the years built to try to solve this problem (e.g. GWT), but it’s still generally a more challenging environment to work in. Throw CSS into the mix, which can do some really cool, untestable stuff, and … well, you get the picture.
Which technologies do you use on a day-to-day basis?
Scala, Play, Handlebars (both the standard JS Handlebars and Gilt’s own Scala implementation–fondly called Scandlebars, and written by Gilt engineer Mark Wunsch. 
What’s your personal strategy for learning a new technology?
My inclination is always to just learn on the job. That only gets you so far, though. And when you’re working on important pieces of software, you need to be the expert in the technologies you are using. Taking time out to really learn those technologies is something I have to work hard at; it’s not something that comes naturally. My preference when I do need to learn something in detail is a good old-fashioned paper book–remember those?
I recently took Martin Odersky’s Coursera course on Scala. This was really enjoyable.
Describe for us some of the projects that you’ve been working on recently.
The team is currently in the process of migrating our sale listing page (the most visited page on Gilt: ~30k rpm at noon) over to a new technology stack: Play, Scala, Handlebars, and Solr. As part of that work we are building a new app and adding a lot of new code to shared libraries.
We are also working to integrate Scalatest/Selenium testing into our continuous delivery framework. Continuous delivery allows us to deploy to production in minutes at any time with no manual interaction after the developer types “sbt release” on their laptop. Having really good Selenium test coverage, written using Scalatest, is a key part of that.
A small side project I’ve just completed is a piece of code that allows you to build “views” of a cache. You simply provide a transformation function, and you get back a virtual cache of a different type. The views themselves can be cached (if the transformation is expensive) and you can stack them, so you can have views of views. Getting the type system to work was a bit of a mind melt, but I think the end result is pretty cool. 
One technology you’ve been using lately is Solr. Tell us more about that.
We started using Solr to power some basic search capabilities on the site in 2011. Galactus then built keyword search using the same technology stack. We are now moving the sale listing page onto Solr–after all, a sale listing is simply a search for all products with a particular sale ID. This means that less code is required to power the site. As part of moving the listing page over, we’re really having to step up the performance of the search technology stack. It has to be scalable and really fast!
What’s been your biggest accomplishment here?
I’ve done a few things that I’m proud of. Early on, I think my biggest accomplishment was “getting” the Gilt technology stack so quickly, and being able to contribute within a few weeks of joining. I’ve since worked on some pretty core pieces of software like Commons, which is a client library for Gilt’s domain model; the sale targeting engine, which targets sales to the appropriate members; and keyword search. I also recently led the redevelopment of the product page: a complete rewrite of the old page from the bottom up.
What would you say are the best parts about working at Gilt? And more specifically, about working at Gilt-Dublin?
The pace–things move very fast all the time. We’re on the cutting edge in terms of continuous delivery, the technologies we’re using, and some of the testing tools we’re building.
Also, the people. Gilt has some great people in so many different areas. I’ve learnt more in my first two years at Gilt than I did in the previous eight years since I left college. The Dublin office, being a bit younger than Gilt NYC, feels a little more like a start-up in some ways. There’s a really good atmosphere. Despite being the new kid on the block, we’re solving big problems and we’re doing great work!
The actual office itself is also fantastic: A penthouse office in the city centre with great views. Plus it’s in Dublin, the best city in the world!
Can you talk a bit about mentoring and your on-the-job inspiration sources?
While Gilt is using some really cool and interesting technologies, I’m an engineer rather than a technologist, so solving problems is what makes me want to go to work each day–and Gilt has some really hard, interesting problems to solve.
I’m also lucky to work with exceptional people. This is also a great inspiration: working with people who, in pretty much every interaction I have with them, teach me something.

---
layout: post
title: Catching up With Open Source Advocate Rocky Bernstein
date: '2014-01-24T16:16:00-05:00'
tags:
- Rocky Bernstein
- Full-Stack Engineering
- Isaiah Belle
- Gilt
- Gilt Tech
- Sam Boyer
- Emacs
- open source
- ruby-debug
- SourceForge
- GitHub
- Greg Chatin
- Byte
- software development
- CPAN
- Debian
- GNU
- Lisp
- Rietveld
tumblr_url: http://tech.gilt.com/post/74416038488/catching-up-with-open-source-advocate-rocky
---


We’re excited to welcome the Full-Stack Engineering meetup back to Gilt on Tuesday, Jan. 28! (Go here to RSVP.) The night’s three speakers include HUGE Principal Architect Isaiah Belle, NBCUniversal Manager of Enterprise Architecture Sam Boyer, and open source advocate/hero Rocky Bernstein. The meetup starts at 6:30 PM at our 2 Park Avenue office and will include discussion of the PHP frameworks Symfony2 and Drupal. Oh, and we’ll also have some delicious sandwiches!
Once described as someone who "lives in relative obscurity,“ Rocky Bernstein is the creator of the Pydb extended Python debugger, the ruby-debug BASH debugger, and many other software tools used daily by millions. He was kind enough to take some time out of his schedule to answer a few questions:
Gilt: In this age of social media, you seem to prefer flying under the radar to self-promoting. Why?
Rocky Bernstein: I’d say that most of the folks who have used software that I’ve written wouldn’t recognize my somewhat unusual name. I have neither a Facebook nor a Twitter account. With social things, there is a quality/quantity trade-off. The few friends that I have are very important to me, and I would rather devote a lot of time and effort towards those, than less time and effort towards more people. With respect to the software, what’s important to me is getting stuff done and problems solved.
G: How do you come up with open source projects to tackle–what’s your creative process?
RB: Invariably the projects find me, and not the other way around. Sometimes people come to me with a request for a feature or something, and I ask them to take a stab at the problem first. A common response is that they don’t know anything about the field. Well, jumping in can be a good way to learn.
The decision to start the CD-reading project was unusual in that it was politically motivated. It came from dissatisfaction with the DCMA (Digital Millenium Copyright Act), which I feel is a little Draconian. I didn’t know anything about CD-reading or physics or debuggers when I started those projects. I like to think that I’ve helped a lot of people learn new fields by encouraging them to just jump in and get started.
 G: How do you prioritize what to work on?
RB: In getting things done day to day, I often encounter annoyances, things that need to be addressed, and things that should be automated. I often have to deal with these by hand in order to get a task done, but later, I’ll think about which things bothered me the most and ask how I can start to address them. I monitor statistics on my projects. For example, anyone who has a GitHub, SourceForge, or code.google.com account can star any number of other projects hosted on that organization. It costs nothing to flag a project.
When I’m looking for something to work on, I’ll look at the analytics for the various projects, and I will tend to work more on those with the most interest. The other kind of place I look at would be the download statistics that you can get from various package repositories: RubyGems, Debian QA, PyPi Ranking.
Q: What was your first open source project? And how many projects have you pursued in total?
RB: I started sharing code before the term "open source” was coined. In the old days, what you would do to let people know about your code was to write some an article about it for a magazine like Byte or Dr. Dobb’s Journal. These magazines would have a place where you could download software mentioned in the articles. For some physics simulations I wrote with Greg Chatin at IBM Research. I arranged that, if people sent me a floppy disk and return postage, I’d copy the programs onto that. Distribution by this method was very limited. A big breakthrough in distribution came from places like SourceForge, where they would host software that could be downloaded. 
This page lists about 40 different open-source projects of mine. Not all of the projects are equal in size or weight, and some I am just a contributor on.
Q: What do you think are the most important developments in the open-source community?
I mentioned public project repositories like SourceForge and GitHub, which make it easy to share code. At about the same time, maybe a little earlier, we started getting repositories for the various languages. Perl’s CPAN was one of the oldest, and that clearly had a big impact on the language.
A feature of the early days was that you generally had to get someone’s approval to share (or a magazine editor’s decision that your software article was newsworthy). In order to get a CPAN account, for example, you needed to request an account, maybe list a project you were working on, and wait for someone to decide. The same is still true for GNU packages and Debian packages. This isn’t necessarily wrong, but it limits the number of contributors.
Nowadays anyone can get an account on GitHub, SourceForge, or code.google.com. The process doesn’t initially require someone’s approval. But there have been many, many other improvements along the way; I have delighted in all of them:
The various testing frameworks
Wikis on projects – anyone can write/improve documentation
Simple issue trackers
Public continuous integration systems like travis.org or drone.io with build status on the project page
irc, jabber, group jabber (e.g. Campfire)
Maybe code-review systems like Rietveld, although I think the jury is still out on those.
G: What do you think are the biggest challenges in successfully launching a project that will gain widespread adoption?
RB: For me, having a project hit the big time feels like hitting the lottery. For example, this Ruby debugger I had been working on hit the big time because someone in the Ruby on Rails project decided to add it as a configuration option. Neither of us working on the debugger were alerted to this possibility beforehand.
So what I do, and recommend doing, is just to focus on things you think important, and focus on the work. If you are lucky, something might happen.
Q: What are your favorite technologies right now?
RB: I’m language-agnostic. In general, I prefer the dynamic languages (Ruby, Python, Lisp, Perl, POSIX Shell) over static ones (C++, C, Java), but recently I’ve been working with Go, a static language, and I’ll probably mention something there [at Tuesday’s meetup].
I use GNU Emacs extensively and have for over 25 years. Initially I was impressed with its on-line help, and undo/redo. But most important from the beginning was the fact that it is completely programmable in a real programming language: Lisp. When I first looked at how Ruby was implemented in C, I found a remarkable similarity with how Emacs was implemented in C. The core Emacs functions are written in Lisp-like C, while Ruby is written in Ruby-like C. In both cases, they both do a lot with very little through the magic of orthogonality. I am impressed with how GNU Emacs, as old as it is, has evolved and adapted over the years.
Finally, having gone through four or so version control systems (SCCS, RCS, CVS, subversion) I’m really happy with Git.
Gilt: How did you find the Full-Stack Engineering meetup group?
RB: NYC is full of diversity. Although I still feel like a visitor, and am constantly learning new things about NYC, I’ve lived here for about 35 years. I really like the idea of Full-Stack Engineering. I joined the group because I want to hear what others have to offer, and so far things have been really great.
Gilt: What do you hope to cover in your talk on Tuesday?
RB: I’m going to try to keep things short, even though I feel passionate about the full-stack development process. There will just be a few things here and there where perhaps I can point out something that folks haven’t heard of, or mention a project I’m working on. I’ll probably also suggest a project that I think should be worked on.
Thanks, Rocky!

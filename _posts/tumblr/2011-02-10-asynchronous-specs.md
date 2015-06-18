---
layout: post
title: Asynchronous Specs
date: '2011-02-10T17:00:00-05:00'
tags:
- frontend
- JavaScript
- TDD
- TestSwarm
- JavaScript testing framework
- Asynchronous Specs
- Gilt
- gilttech
- asynchronous behavior
- Kevan Davis
- ASpec
- RSpec
- submission
tumblr_url: http://tech.gilt.com/post/3221966724/asynchronous-specs
---
While working on TestSwarm, we ran into the problem that none of the JavaScript testing frameworks out there had really solved the problem of how to test asynchronous behavior without requiring the test writer to do something different from how (s)he would test non-asynchronous behavior.

e.g. Testing these two lines should be done the same way:

callThisImmediately(function () {});
callThisIn5Seconds(function() {});


Every other testing framework we looked at required using something like wait() and resume(), or mock timers, or completely ignored the problem.

So…I decided to write my own testing framework, with testing asynchronous behaviors (like AJAX requests, animations, countdowns, timeouts, etc.) in mind from the very beginning. Since we also have a lot of Rubyists here, we wanted the syntax to be as close to RSpec as possible.

Thus was born ASpec:



For the most part this was fairly straightforward, but there were two itty bitty little problems. The first was of course… how does ASpec know that there is asynchronous behavior? And two, what should it do about it?

We solved the first one using a little regex and Function.prototype.toString(). Simply put, ASpec counts the number of expects in an it block before it executes that it block. when an expect gets executed, we count that too. When we exit the it block, if the two numbers aren’t the same, well, chances are that there was asynchronous behavior. Either that or unreachable code, conditional statements, or a good old runtime error.

As for the 2nd problem, we solved that too. If we have any pending expects, everything after that gets put into a queue, and is executed after the pending expect is done. Or times out.

When everything is done, we wind up with a nice little report that TestSwarm can take a screenshot of:



Well, that’s okay (sorry about the purple), but if I’m testing something, I’d rather not have to leave the command line in order to do so. Not to mention, I’d like to have a way to test all my specs at once. And of course, I’d like to be able to test everything before I commit.

Therefore, we created a little rake task: rake spec. If you’re a Rubyist, it probably sounds familiar.

Our version of rake spec even produces output similar to the RSpec version:



If you peek under the hood, what you’ll see is a couple simple-minded tcp servers, and the Mac OSX open command (with the --background flag).

And of course, since we want to be able to test in different browsers, we can run rake spec:firefox, rake spec:chrome and rake spec:safari. Sorry, IE.

Kevan Davis, Gilt Groupe

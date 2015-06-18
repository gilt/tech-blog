---
layout: post
title: Continuous Integration for JavaScript with TestSwarm
date: '2011-02-09T15:06:00-05:00'
tags:
- TDD
- continuous integration
- javascript
- frontend
tumblr_url: http://tech.gilt.com/post/3202534088/test-swarm
---
We like the principles of Test Driven Development (or some variation thereof). But we also have an increasingly large JavaScript library, and JavaScript testing is hard.

There are tools like Selenium that offer a full testing suite and there are tools like Webrat that simulate a browser for application acceptance testing, but those tools still don’t solve the “JavaScript testing is hard” problem. That problem is browsers.

John Resig and team ran into this problem while developing jQuery:


  The end result is that we need to run 10 separate test suites in 12 separate browsers before and after every single commit to jQuery core. Cross-Browser JavaScript testing does not scale.


That blog post really defined the problem. We Front End Engineers needed some Continuous Integration love: An automated way of testing our JS libraries across multiple browser environments.

Resig also came up with a solution to the problem, and we’ve recently rolled it out here at Gilt: TestSwarm.


  TestSwarm provides distributed continuous integration testing for JavaScript.


Users (on various browsers) connect to the server and run the test runner. The runner will wait for new suites to come in from a git hook.


The results are recorded for each commit and hopefully everything is green.


And now we have to begin the hardest part of this task: beginning a TDD practice and making sure our JavaScript has full test coverage.

Mark Wunsch
Gilt Groupe

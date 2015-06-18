---
layout: post
title: Automating Mobile Testing at Gilt
date: '2013-09-17T16:04:00-04:00'
tags:
- Mobile development
- gilttech
- Appium
- KIF
- UIAutomation
- UI testing
- XCode 5
- XCTest
- Selenium
- Jenkins
- automated testing
- quality assurance
- automating mobile testing
tumblr_url: http://tech.gilt.com/post/61521483462/automating-mobile-testing-at-gilt
---

Just a few years ago, mobile purchases made barely a dent in Gilt’s revenues. Today, mobile represents more than 40 percent of our sales, and will soon reach 50 percent. With so many of our customers interacting with us through their mobile devices, it’s imperative that we offer them a stable and enjoyable shopping experience. One bad bug can drive away customers for good.
Given the increasing importance of mobile to our business, and therefore the need to expand the number of teams that can contribute to our mobile applications, the Gilt mobile team has been hard at work improving and streamlining our testing processes. This post will describe our automated testing efforts, the technologies we use, and what lies on the horizon—both for us, and for the automation tools we use.
Testing at Gilt: A Brief Overview
In the early days of Gilt Mobile, none of our testing was automated. This was workable at the time because only one team–the mobile team–worked on the applications. We followed a fairly simple development cycle, as follows:

Our crew of mobile engineers would implement a series of new features, as determined by product management. 


Known issues would be prioritized by severity, and fixed accordingly. 


We would internally release versions of the application for testing purposes on a regular basis. 


An overseas team of testers performed high level feature testing, regression testing, and other testing not covered by engineering during development. 


The QA team would be responsible for the testing of new features, stress-testing the app in an effort to find new issues and performing of a suit of sanity tests to make sure that basic app functionality remained intact. 


Once QA gave the go-ahead, we’d sign the build appropriately and submit to the iOS App Store.

As mobile has become more critical to the business and more teams have started to contribute to our mobile applications, QA has become increasingly important—particularly in iOS, where we concentrate most of our development efforts. With an increasing install base, more contributors, and more features, comes increased complexity. Ensuring that the app is issue-free when we submit to the App Store for approval has become more important than ever.
Understandably, the performance on mobile has generated a lot of excitement within Gilt. This has led to increased emphasis on mobile development within Gilt tech in general. We’re starting to see increased involvement from engineers on other teams, and having a loosely defined development process makes it difficult for newcomers to get up to speed and contribute to our efforts. How can we help them? With well defined process and a dash of automation!
Our Development Process Today
We’re gradually migrating to more of a test-driven workflow. We still depend very heavily on manual QA, but this is now supplemented by a suite of automated tests. Our development process is increasingly starting to look like this:

Developers are encouraged to write tests for their current features and fixes.


Instead of hand-building test releases at random, we now have Jenkins performing nightly builds.


Builds are followed by a run of functional tests.


Generated test reports are delivered to all team members, and can give detailed information on exactly where and how a failure occurred.

The intent is to free up QA from having to do repetitive and time-consuming sanity tests, which allows them to focus on testing new features and find issues before our users do.
The automated test framework we started with was KIF: Keep It Functional. Maintained by Square, KIF is quite mature. Using KIF was something of a proof of concept for us–more of a first step toward getting our automated testing situation under control. As such, we didn’t go through the exercise of writing an entire sanity test suite, but instead produced a couple short tests of basic functionality.
What we like about KIF: Tests run in the same process as the app, and so have access to notifications. This is pretty handy when testing asynchronous parts of your app. What we don’t like: it’s heavy on private and undocumented accessibility APIs. There may be some disagreement on how big a deal this is, but Apple’s under no obligation to keep these APIs consistent, and can do away with KIF dependencies without notifying anyone–which would make things pretty difficult to fix. Setting up KIF with Continuous Integration–while not impossible–could be easier.
Lately we’ve been trying out Appium, a tool we started exploring after one of our engineers learned about it at this year’s Selenium conference in Boston. Appium is built on top of UIAutomation: a framework, provided by Apple as part of Instruments, that enables you to interact with apps programmatically. We’ve used UIAutomation quite a bit in test prototyping and debugging. 
So, Appium doesn’t use any private APIs or resort to any cloak-and-dagger hackery to get the job done. Great! But that’s only the start of how Appium captured our attention. Appium is built on the idea that testing native apps shouldn’t require including SDKs or recompiling your app. You should be able to use your prefered test practices, frameworks, and tools.
Appium is able to achieve all this by implementing a large portion of the Selenium JSON wire protocol, and essentially translating these calls into sets of native framework commands–UIAutomation and uiautomator, for iOS and Android respectively. It’s really this aspect alone that has us hooked. Our Web team has been down this path before, and has already built out a testing infrastructure revolving around Selenium, Scala, and ScalaTest. Using Appium has allowed us to take advantage of large chunks of our preexisting work. No reinventing the wheel, and no learning the hard way. This also provides us with a nice entry point for other Gilt engineers interested in working on mobile.
While it didn’t take long for us to get up and running with Appium, I still can’t say that it suits the needs of  everyone out there building apps. Smaller teams with no Selenium experience or existing infrastructure might feel a little more comfortable sticking with something like KIF or Calabash.
Can we do better? (Always)
Like everything else, Appium isn’t perfect. Areas where Appium could benefit from significant improvement:

For us, the Appium XPath engine is quite limited, and can only evaluate simple XPath expressions. It might be nice to see Appium use something like Cameron McCormack/Yaron Naveh’s  XPath parsing package for node.


Another, more minor gripe is that tag names used on the web don’t correspond with their mobile equivalents in Appium. For example, a text field on the web has the tag name “ input.” Appium calls these tags either “textfield” or “UIATextfield,” which brings us to another issue… 


I say “either,” because doing something like driver.findElementsByTagName(“textfield”).getTagName() returns “UITextField.” Nothing shocking here, but perhaps the tag name we search for and the tag name returned should be the same thing? 

The good news is that development activity on Appium is really high, and its (notably friendly) community is rapidly addressing its shortcomings. You developers out there who are looking for projects can always get involved in fixing some of this stuff. Some of us on Gilt’s mobile team have recently put some fixes into Appium.
Final Thoughts
 At Gilt, we’re trying to create a culture that promotes a proactive approach to testing. For now we’re focused on taking a load off of the QA team by automating UI testing. Gradually we’ll move on to integration testing. Long-term, we’d like to adopt a TDD-centric workflow, with developers creating tests from the outset, and taking responsibility for test maintenance.
While frameworks like OCUnit and UIAutomation are relatively well documented, it doesn’t seem like any heavy emphasis has been placed on testing as a part of the development cycle. The tools are provided, but not evangelized. Fortunately, this is changing. Xcode 5 will feature some terrific test and automation centric enhancements such as XCTest, and the Bots Continuous Integration system. KIF is revamping its API with KIF-Next to get in line with Xcode 5 and take advantage of its new features. And Selenium 3, which is in the spec stages, appears set to become a tool for user-focused automation of mobile and web apps. All-round, the future for automation and testing native mobile apps is looking brighter.

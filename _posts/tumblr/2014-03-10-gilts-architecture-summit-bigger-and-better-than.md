---
layout: post
title: 'Gilt''s Architecture Summit: Bigger and Better Than Ever'
date: '2014-03-10T16:24:00-04:00'
tags:
- Gilt
- Gilt Tech
- Gilt Groupe
- Architecture Summit
- '2014'
- software engineering
- micro-services
- culture
- Michael Bryzek
- Steve Jacobs
- Eric Bowman
- Kevin Scaldeferri
- LOSA
- lots of small applications
- decentralization
- simplicity
- velocity
- semver
- SBT
- semantic versioning
tumblr_url: http://tech.gilt.com/post/79191202839/gilts-architecture-summit-bigger-and-better-than
---


In late February nearly 100 members of the Gilt engineering team gathered at our New York City office for our 2014 Architecture Summit–a full day of keynotes, micro-presentations, deep-dive breakout sessions, delicious food, and “real talk.” One of the highlights of the year for the Gilt tech team, the Summit gives our engineers an opportunity to discuss what we’re working on and why, trade ideas on how we build software (and how to build better), and make key decisions about how to drive the tech organization forward. An annual tradition since 2012, this year’s summit was our largest to date!
As noted by Gilt Co-Founder/CTO Michael Bryzek and CIO Steve Jacobs during the morning’s opening talks, in 2013 our company was cash-flow positive for the first time in its history. Growth is good! But with growth comes new challenges and complexity–which made this year’s summit the perfect time to reiterate the importance of simplicity. As Gilt VP Architecture Eric Bowman noted in his “State of the Architecture” keynote, simplicity becomes even more critical the larger your organization becomes. How can Gilt continue to keep our operations streamlined and efficient? Eric offered a strategy to address this concern, focusing on these key points:

Type safety


Automation


Continuous Delivery


Team ownership of end-to-end quality

Partitioning, decoupling, maintaining isolation between unrelated services, automating our testing environment, and continuing onward with our LOSA (“Lots of Small Apps”) approach to development are all essential in keeping our development process as friction-free as possible while keeping complexity under control. All of these also contribute to a culture of autonomy and decentralization, which leaves teams free to deliver high-quality software quickly to production without much process or management overhead–and helps teams to focus on the specific problem at hand. 
With a development environment that holds decentralization as one of its most prized attributes, it can be hard to get a precise and accurate view of how fast we are moving. Traditional agile metrics like “velocity” require a more centralized approach than Gilt practices. One way to get a feel for whether the introduction of continuous delivery at Gilt has worked is to look at how quickly we are adding new features. A very rough metric for this: how often our systems release major and minor releases–compared to bugfix releases–based on the version number. (At Gilt we tend to use semver, which gives a rough indication of whether we are adding features or just fixing bugs.) By analyzing the rate of releases based on version, we observed that every month we are making roughly two more feature releases than during the month before. The graph below illustrates this: 
In fact, we know we’re releasing more features than this, because semver adoption on the front-end is much less strict than semver adoption of shared components!
Micro-Services and LOSA
Gilt Principal Engineer Kevin Scaldeferri offered his own “state of” address, focusing on the current status of our micro-services architecture. Our shift from a monolithic Ruby app to a system of hundreds of small services (more than 300 as of February 2014) has enabled our engineering team to achieve much faster release cycles than ever before–decreasing from days to minutes–as well as write less complex code and preserve our culture of team independence. At the same time, though, there are challenges in managing such a large number of services. Kevin displayed a number of graphs and statistics designed to measure the size and complexity of each of our services, the nature of the dependencies between services, and the development and deployment patterns which have arisen. Our goal is to use these data points to better understand the current state of the system, and keep it evolving in a manageable and scalable way. 
From Micro-Services to Micro-Talks
One of the highlights of this year’s summit was the afternoon session, which featured 30 micro-talks delivered by members of the engineering team. Many of the talks reiterated the morning’s call for “keeping it simple”: from using Docker to create lightweight containers that are portable and self-sufficient, to learning SBT. Other talks emphasized aspects of our business–PayPal integration, email delivery, business rules, our responsive design approach–and how we’re improving them. Some of the team’s micro-talks are almost ready for public consumption: We hope to share the final results with you over the coming months.
After the day’s talks concluded, the team assembled in our 5th floor cafeteria to eat a delicious buffet (including many vegetarian options) and collect some new books from the annual Summit book giveaway. This year’s selection–Viktor Frankl’s Man’s Search for Meaning, Duke Behavioral Economics and Psychology Professor Dan Ariely’s volumes on human irrationality, Abundance: The Future Is Better Than You Think by Peter Diamandis and Steven Kotler, and about a dozen other titles–emphasized finding the meaning in everyday activities (including software development), remaining open-minded and mindful, and challenging commonly held assumptions. 
The TL; DR version: We’ve come a long way since our founding days in terms of agility, release time for high-quality features, and team independence. We have uniform build automation, better uptime, continuous delivery, and a bigger team than ever to constantly develop, innovate and improve. Our significant business growth continues to anchor all of this innovation and creativity. 
As the week came to a close, and our engineers from other offices left NYC for their homes around the world, we returned to our laptops full of energy and passion to continue to make Gilt both a great company and an amazing place to work!

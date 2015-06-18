---
layout: post
title: Making Architecture Work in Microservice Organizations
date: '2014-11-14T14:42:00-05:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- microservices
- micro-services
- architecture
- software development
- Architecture Board
- Architecture Council
- microservice architecture
- Scala
- Node.js
- technology management
- open source
- Andrew Harmel-Law
- JVM
tumblr_url: http://tech.gilt.com/post/102628539834/making-architecture-work-in-microservice
---


Gilt today has an expansive microservice architecture, with many decentralized engineering teams working autonomously to build and deploy services to production. There are many benefits to this sort of structure, but there are also many challenges. One of those challenges is ensuring consistency of architecture across dozens of teams and hundreds of services.
We continuously evaluate our internal practices, and recently have made a few significant changes to how architecture works at Gilt.
One of the biggest changes is that we no longer have an official “architecture” team. Instead, we have made “architecture” an “ingredient” on each of our teams, recognizing that the majority of architectural decisions are in fact made by the engineers on each team. We’ve also created a small group of engineers to serve on an “architecture board” whose broad purpose is to ensure the sharing of best practices, and to identify the very few standards we need to govern– mainly where technology crosses team boundaries (e.g. how software built by one team talks with software built by another team).
In the broadest sense, we apply learnings from how the open source community and the Internet work to how teams interact with one another.
One of the tools we use to help all Gilt architects share best practices is the Architecture Council: a quarterly meeting designed to highlight key issues and bring people together to brainstorm and solve hard problems.
Some of the most pressing questions discussed at our November council: 
What does it mean to be an “architect”? 
At what level can Gilt engineers make independent technology choices? 
How do we see our work with Node.js evolving over time? 
And what are the limits of having a microservice architecture?
The Benefits and Challenges of Microservice Architectures
If you’re unfamiliar with the particulars of microservice architectures, the writings of Martin Martin Fowler and Adrian Cockcroft’s ongoing work exploring microservices are great resources. Despite growing in popularity as a discussion topic–enough to earn their own conference track and inspire heated, blogged-about Twitter debates among knowledgeable technologists–microservice architectures have been adopted by very few companies. Among this few are Gilt, Amazon, Netflix and LinkedIn. 
“The Microservices architectural style is still definitely in the honeymoon period,” writes Andrew Harmel-Law in his recent post on the positives and negatives of microservices. Later in his post, he adds: “We’re finding that despite all the noise in this space very few folks out there are actually doing this, and even fewer doing it in a public manner.” 
Our experience at Gilt is that the pros of microservices outweigh the cons. As we’ve shared previously in conference talks and blog posts, Gilt adopted a microservices approach to architecture during a time of explosive growth for our business. After starting out as a monolithic Rails app in 2007 (the year Gilt was founded), Gilt transitioned to the JVM in 2009 (using Java) and began building out its microservice architecture with about 10 “macroservices.” In 2011 we transitioned to Scala. In 2014, we introduced Node JS; today we have upwards of 300 microservices in production. 
Adopting a micro-services architecture has enabled our engineers to write simpler code and speed up release cycles from days to minutes, while making production deploys safer. It has also reinforced our culture of team autonomy, decentralization and end-to-end ownership of quality. Every way we measure, teams are releasing major features more frequently than ever before, and almost always with absolutely minimal risk.
That said, there are challenges to maintaining a microservice architecture. As the number of our services and applications continues to increase, conscientious management becomes ever more important. Monitoring performance of specific microservices isn’t straightforward. Proper alerting is both critical and entirely different, with very few options available to trigger high quality alerts across hundreds of applications. And when the number of microservices exceeds the number of engineers on your team, how will the engineers manage the ongoing maintenance and ownership of those apps?
Now that we’ve talked about microservices, let’s get into the Architecture Council and Board.
Why We’ve Created the Council
Until recently, Gilt had a designated Architecture team whose members–working in Dublin, NYC, and remotely–handled most of the major aspects of architecture. While this structure worked fairly well for a number of years, there was tension between a centralized architecture team and a decentralized micro-services organization. The reality is that with so many independent applications, it is the engineers on each team that make significant architectural decisions on a regular basis - and that we needed to evolve our structure to better embrace this struture.
Some of the Council’s Specific Objectives:

Make it easier to brainstorm solutions to problems and to share results


Highlight best practices across all our teams


Minimize duplication of effort across Gilt


Define standards for inter team communication


Assist teams in solving hard technical problems in simple, scalable ways


Assess specific technologies - already at Gilt or not yet in use at Gilt

Heading up the Council’s work and direction is the Architecture Board.
The Architecture Board: How It Works
The Board

The Architecture Board includes four members and a chair, each of whom serve 24-month terms. Each board member continues to work on an engineering team as their primary activity. The Board reports to the CTO.


Members can serve no more than two consecutive terms.


Members devote 25% of their time to Board responsibilities


Members work with the rest of the engineering teams on hard problems


The board ensure that all standards are actively reviewed for modification / cancellation on a set interval (from one to two years)


Primary duties:


Convenes quarterly meeting for all architects to discuss proposed standards, share best practices on reviewing key RFCs, conduct in-person design reviews, etc. 


Makes it easier to brainstorm solutions to problems and to share results


Highlights best practices across all our teams


Minimizes duplication of efforts across Gilt


Defines standards for inter-team communication


Assists teams in solving hard technical problems in simple, scalable ways


Assesses specific technologies both already in use at Gilt and not in use yet

The Board Chair

Convenes board meetings as necessary (at least 2x/month)


Drives transparency, sharing agenda and minutes from each board meeting with all of tech; a directory of the board’s past decisions; and a published internal metric for how decisions are made

Selecting and Replacing Board Members

The board’s terms are set up so that one member rotates out every six months, and a new member joins


To serve on the board, an engineer has to have served as an “engineering architect” for at least 12 months (doesn’t have to be consecutive)


Engineers who have served on the board during the previous 12 months are ineligible.


The board will solicit nominees at their monthly/bimonthly meetings


Incoming board members serve as observers during the month before their official term begins


New members ideally receive unanimous board consent (includes CTO)


When the chair rotates off the board, the board will decide its own chair

How the Board Makes Decisions
The goal is for the board and the CTO to agree unanimously on proposals. If there’s disagreement:

The board will vote, and if a majority approves the proposal, it passes for CTO review


If there is a tie, the chair will decide whether or not the recommendation moves forward


The CTO is the benevolent dictator for life and reserves sole discretion to approve or reject a proposal 

In some cases the board must do some exploratory work before making a decision on a proposal. These situations and the timelines for exploration can be identified through the normal decision-making process. If the exploratory period ends and the board still doesn’t make a decision, the CTO also reserves the right to make the decision or to extend the time period.
What We Discussed and Decided
One of the goals of each quarterly architecture council is to agree on 2-3 key initiatives to focus on until the next council meeting. This time around, the group agreed to:

Enhance the Security of our PostgreSQL Databases.  We now have more than 50 unique PostgreSQL databases across multiple servers, both in our data centers and in the cloud. We agreed to invest time to increase the overall security and management of these databases.


Adopt Commons 6, the latest internal library providing the API to most of Gilt’s core ecommerce libraries and services. Commons 6 is a major release for us–replacing a Java- with a Scala-centric API, while maintaining upgradeability for older services written in Java.

We also broke up into smaller groups to discuss some of the key aspects of our tech culture: microservices, team ownership of end-to-end quality, and independent introduction of new technologies at Gilt. We’ve already covered microservices above, so here are some highlights of those other breakout discussions.
Team ownership of software:

The Council discussed how to define ownership, some processes to transfer ownership, and ways to match initiatives and projects to owners. We hope to formalize this work in February.

How independent technology choices can be made at Gilt:

We value having the ability to pick the best technology for a given domain, even if it is not widely used across all of Gilt (e.g. R for data scientists)


Critical pieces of infrastructure should not be built using experimental technologies


Individuals wanting to introduce a new technology should do so by convincing their peers in their department. Departments at Gilt are big enough to take on the long-term maintenance of that technology. It’s great that this can be a department-level decision and not a global Gilt decision

Using Node.js as a platform for web applications:

The checkout team at Gilt is rewriting our checkout application in Node–and loving it!


Node empowers front-end engineering, and improves our tech culture by allowing for greater participation in the broader front-end community.


Simplifies library consumption, enabling thinner web apps. Expand usage to smaller satellite apps that do not receive a lot of traffic.

Conclusion
Our hope with this and future Architecture Council posts is to contribute our experiences and ideas to the ongoing conversation about microservice architectures and help answer some questions about how tech teams can successfully manage them. It’s been our experience that microservice architectures really enables teams to make the best choices for their domains. Stay tuned for more on this topic–there’s much more to learn and discover.

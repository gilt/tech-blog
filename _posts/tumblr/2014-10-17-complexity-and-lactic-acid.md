---
layout: post
title: Complexity and Lactic Acid
date: '2014-10-17T13:14:00-04:00'
tags:
- Scala
- lactic acid
- complexity
- training
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Jim Englert
- management
- software development
- software engineering
tumblr_url: http://tech.gilt.com/post/100250365564/complexity-and-lactic-acid
---

I work as a lead software engineer for Gilt–my team focuses on our email operations, from design to distribution. I also spend a lot of time training for endurance events such as triathlons and long distance cycling. During the requisite hours and hours of preparing for these events, I spend a lot of time thinking about my workouts and my work at Gilt. One result of all this contemplating is that I’ve come up with an interesting parallel between how a successful athlete deals with stresses to the body, like excess lactic acid build-up–and how a successful business deals with the complexities of its business (ie excess systems build-up). Let me explain.
First Things First: What Is Lactic Acid? 
Lactic acid is a chemical that builds up in your muscles during intense exercise. Accumulation of this acid in your muscles leads to muscular fatigue. It’s that feeling you get after an intense run, when your muscles just can’t work anymore.
Your body removes lactic acid continuously through your blood stream.  A good way to understand this process is to visualize a cup with a hole in the bottom.  As you exercise, you are pouring water into the cup–causing more and more lactic acid to build up in your muscles.  Water drips out the bottom continuously, much like your blood removes the lactic acid from your muscles. As more lactic acid builds up, your ability to perform is reduced. It’s a non-linear scale. Increasing volumes of lactic acid reduce your ability to perform by greater and greater amounts.
What, Exactly, Constitutes Complexity in a Business?
My dictionary describes complexity as “many parts where those parts interact with each other in multiple ways.“  My own definition gives the term a pretty broad scope. I see "complexity” as being anything that changes the parts involved, or the interactions of those parts. A short list of things that count in my book:
Employee turnover
Hiring new people
Changing project focus
Employees changing roles
Etc…
As you might expect, I paint with a broad brush on the technical side as well:
New services
New build systems
New languages
New data centers
Different programming ideologies (i.e. reactive, dependency-injection, etc…)
New release procedures
Any changed lines of codes
Etc…
So, almost everything adds a bit of complexity. But the good news is that most complexity goes away with time. Bugs are crushed. Employees undergo onboarding and get up to speed. Old systems are decommissioned. Systems become more stable.
How Are Lactic Acid and Complexity Connected? 
An organization’s ability to handle complexity is very similar to the body’s ability to handle lactic acid. We can maximize throughput in an organization by monitoring the rate at which we allow complexity to seep in; this is very similar to what endurance athletes do every day. “Saving” a bit will allow their bodies to go further and faster. I think “saving” applies to businesses as well. Relating this to my work at Gilt: I pay a lot of attention to the rate at which we introduce complexity. I choose projects for my team that maintain a healthy amount of complexity in order to ensure high throughput.   
At Gilt, we introduced quite a bit of complexity by migrating between binary incompatible versions of Scala. Libraries needed to be built to support both versions. Projects needed to be upgraded. In the short- to medium-term, this made life hard. As time went on, however, much of that complexity disappeared as we got better at migrating projects and completed more of the overall migration. These natural reductions in complexity are similar to the blood removing lactic acid from muscles. 
Much like having too much lactic acid in your blood, introducing too much complexity at one time will slow down progress considerably. A business who wants to succeed (“win the race”) has to control the amount of complexities it introduces initially, and wait for its “blood stream” to cleanse some of the complexities before introducing new ones.

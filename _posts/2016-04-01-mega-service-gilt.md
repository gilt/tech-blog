---
layout: post
title: "Breaking the Mold: Megaservice Architecture at Gilt"
author: Adrian Trenaman 
date: '2016-04-01'
categories: 
- aws
tags:
- aws
- codedeploy
- newrelic
- notifications
- micro-services
- april-fool
redirect_to:
- http://tech.hbc.com/2016-04-01-mega-service-gilt.html
---

Today we announce a novel approach to software and system architecture that we’ve been experimenting with for the last while at Gilt: internally, we’ve been referring to it ‘mega-service’ architecture, and, the name seems to have stuck. We’re pretty excited about it, as it represents a real paradigm shift for us.

In a mega-service architecture, you take all your code and you put it in one single software repository, the mega-service. There are so many advantages to having a single repository: only one code-base; no confusion where anything is; you make a change - it's done, and will go out with the next deploy. It all compiles, from source, 100% of the time at least 50% of the time. Software ownership is a perpetual challenge for any tech organisation: in the mega-service model, there are many, many owners which means of course that the code is really, really well owned. 

The mega-service is deployed to one really big machine: we prefer to run this in our own ‘data centre’ as we believe we can provision and run our hardware more reliably and cost-effectively than existing cloud players. The benefits of having a mega-service application are manifold: there's one way to do everything and it's all automated; code instrumentation, configs and metrics are all consistently applied, and, all eyes are on the same project, scripts and code, so people are more familiar with more parts of the system. 

We’ve abandoned the sophisticated distributed code control mechanisms of recent lore in favour of a big ‘directory’ hosted on a shared ‘file server’. We’ve resorted to an optimistic, non-locking, non-blocking, zero-merge, high-conflict algorithm called ‘hope’ for contributing code changes: we copy the changes into the directory, and then ‘hope’ that it works. Rather than work with multiple different programming languages and paradigms, we’ve settled on an ‘imperative’ programming style using a framework we’ve recently adopted called Dot Net. Aligning previous lambda-based actor-thinking to a world of mutable variables, for-loops and ‘threads’ has not been easy for us; however, we suspect that the challenges and difficulties we’re experiencing are mere birthing pains and a clear sign that we’re heading in the right direction: if it’s hard, then we must be onto something.

This new architectural approach is an optimization on Neward’s ‘Box-Arrow-Box-Arrow-Cylinder’ pattern, reduced to a profoundly simple ‘Box -Arrow-Cylinder’ diagram (despite forming an elegant visual, the solution is just slightly too large to fit in the margin). We typically draw a box (our monolithic code) on top of a cylinder (our monolithic database), both connected with a line of some fashion; however, some have drawn the box to the left, right or bottom of the cylinder depending on cultural preference.  Distinguished Engineers at Gilt have postulated a further simplification towards a single ‘lozenge’ architecture incorporating both code and data store in a single lozenge: while that architecture is theoretically possible, current thinking is that it is unlikely that we will get to prototype this within the next ten years.

New architectures require new thinking about organisational structure: everything so far points to a need for a software organisation of about five Dunbars in size to maintain our code-base, structured with a golden-ratio proportion of about eight non-engineering staff to every five engineers. Additionally, the benefits of really thinking about and formalizing requirements, following through with formal design, code and test over long periods, in an style we refer to as ‘Radical Waterfall’, bring us to a rapid release cycle of one or two releases per solar year. 

While most readers will be familiar with open-source contributions from gilt on http://github.com/gilt and our regular talks and meetups, the innovations described in this post are subject to patent, and available through a proprietary licence and submission of non disclosure agreement. We’ll be releasing details of same on our next blog post, due for publication a year from now on April 1st, 2017.


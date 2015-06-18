---
layout: post
title: 'Immutability and Innovation @ Gilt: The Perfect Storm'
date: '2013-11-10T04:02:00-05:00'
tags:
- Roland Tritsch
- FutureStack
- innovation
- New Relic
- Gilt
- gilttech
- devops
- all-ops & zero-waiting
- Scala
- functional programming
- immutability
- testability
- concurrency
- synchronization
- configuration management
- Galactica
- Martin Fowler
- SnowFlake servers
- Puppet
- Chef
- Phoenix server
- Chad Fowler
tumblr_url: http://tech.gilt.com/post/66553349381/immutability-and-innovation-gilt-the-perfect
---
Two weeks ago I was in San Francisco to present a talk at New Relic’s FutureStack conference about the value of immutability for HW- and SW-provisioning.


Gilt is now more than six years old, and we are still working as hard as ever to deliver an inspiring shopping experience to our members every day.
Two things we care about a lot to make this happen are uptime and innovation. When the site is not available, we obviously lose money. More importantly, we disappoint our members, who come to Gilt.com with anticipation, and who are excited to get inspired by what we have curated for them on that day. This means that delivering on 100% uptime is something we are very passionate about.
Keeping our rate of innovation high is equally important for us. We are not a 10-person start-up anymore. We have more than 100 engineers working on the site every day. At Gilt, we have a very unique approach to innovation. We believe that we can continue to grow and keep on innovating like a start-up through decentralization, trust and empowerment.
One way we trust and empower our teams is by allowing them to deploy to production directly. We call this All-Ops & Zero-Waiting.
But how can you have 100 people deploy to production directly and still keep the site up and working? 
One observation from the FutureStack audience: It’s very hard to have this rapid rate of change and ensure that the production environment remains consistent. Obviously, there are configuration management tools that aim to avoid configuration drift. But in reality, it is very hard to always update all components consistently, which means you run the risk of ending up with a system that is fragile and brittle. A system that you are afraid to change.
It seems that you are between a rock and a hard place. It seems that you cannot have both: Uptime and Innovation. 
Two years ago we embraced Scala and functional programming. One of the key concepts of the functional programming approach is to rely as much as possible on immutable data structures. It basically means that you only create and delete data, but you never update it. With this, the testability of your system improves dramatically, and a couple of very difficult problems (e.g. concurrency and synchronization) become much more manageable.
Last year we started to ask ourselves if applying the concept of immutability to configuration management in production environments would help us in our quest to innovate as fast as possible while maintaining the highest possible uptime record. We now think the answer is yes. In the last 12 months we have invested heavily in Galactica, our own HW- and SW-provisioning platform. Galactica will allow us to make changes to our HW- and SW-production environment in a very safe and manageable way, in that it will only create and delete HW- and SW-resources, but never update them.



This kind of thinking has gained some momentum.
 Martin Fowler talks about the problem of SnowFlake servers and suggest that you can solve it with configuration management tools like Puppet or Chef. At the same time, he also recognizes that, with this approach, you can only avoid some of the configuration drift, and that you should get into the habit of frequently recreating your servers from scratch (he calls this the Phoenix server approach).
Galactica is going to take Fowler’s thought one step further and will never update any deployed HW- or SW-resources. It will only create them and delete them. If you need to change a deployed HW- or SW-resource, you create a new resource with the new configuration and delete the old one. And this goes for HW-resources (e.g servers) and SW-resources (e.g. services).



I think there are more companies that are starting to work and think this way. For instance, Google never repairs any HW. If a server fails, they throw it away and spin up a new box.
Chad Fowler has also started to blog and talk about what he calls “disposable components.” He basically compares a running system with the human body, and the components of the system with cells of that body. He also points out that small is good and beautiful, that repairing or fixing a cell is expensive, and that it is probably better to just replace a broken cell with a new one.
At Gilt we are confident that by embracing immutability as a key concept for our deployment platform, we can actually have both: High uptime and high rate of innovation.
And I like the sound of this!

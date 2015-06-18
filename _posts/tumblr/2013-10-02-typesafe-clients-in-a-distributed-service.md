---
layout: post
title: '"Typesafe Clients in a Distributed Service Architecture" [Slides]'
date: '2013-10-02T14:00:00-04:00'
tags:
- Eric Bowman
- slideshow
- Aarhus
- Typesafe
- distributed service architecture
- conferences
tumblr_url: http://tech.gilt.com/post/62915181248/typesafe-clients-in-a-distributed-service
---



Earlier this week Gilt VP Architecture Eric Bowman presented “Fast but Not Loose: Typesafe Clients in a Distributed Service Architecture, a Retrospective” at the GOTO conference in Aarhus. The details:

Gilt Groupe is an innovative online shopping destination offering its members special access to inspiring merchandise, culinary offerings, and experiences every day, many at insider prices. Every day at noon New York time, Gilt launches dozens of new sales which draw many thousands of visitors to the site, often within the span of a few seconds around noon. As a result, Gilt has some challenging technical & non-functional requirements, and the Architecture Team at Gilt is focused on how to scale Gilt’s model to accommodate more sales, more customers, and more people working on the system. Gilt Groupe’s service architecture started as Ruby, migrated to the JVM but kept a hashmaps & JSON approach, and then migrated again to a typesafe, futures-based strong client model implemented in Scala. This talk is a retrospective on this journey with particular emphasis on the last approach. What are the benefits of a strong client model? When did it slow down development, and when did it speed it up? How did we handle binary compatibility across hundreds of services (or did we??)? How do we guarantee compatibility across multiple versions of the client stack?  Would we do it this way again?

The slides from Eric’s talk are now available–just go here to view.

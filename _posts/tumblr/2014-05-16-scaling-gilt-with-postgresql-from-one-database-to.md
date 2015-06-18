---
layout: post
title: 'Scaling Gilt with PostgreSQL: From One Database to Many (Case Study)'
date: '2014-05-16T12:37:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- PostgreSQL
- databases
- open source
- Michael Bryzek
- Postgres
- PGConf.EU
- Docker
- schema evolution manager
- Hot Standby
- 2ndQuadrant
- replication
- ecommerce
- relational databases
- PostgreSQL 9.0
- data
tumblr_url: http://tech.gilt.com/post/85923439469/scaling-gilt-with-postgresql-from-one-database-to
---


Gilt is an innovative online shopping destination offering its members special access to the most inspiring merchandise and experiences every day at insider prices. Gilt continually searches the world for the most coveted brands and products, including fashion for women, men, and children; home decor; and unique activities in select cities and destinations. We believe that every day is an opportunity to inspire and be inspired.
Since our founding in 2007, we have built Gilt into an e-commerce leader by almost entirely using open-source software. We have also created a large and diverse array of in-house software to provide amazing customer service, to deliver perfect operations (inventory, payments and shipping), to address our unique daily intense traffic spike, and much more. When it comes to relational databases, PostgreSQL was both our launch database and today is the core of our relational strategy–and we’re proud to have played a part in its growth and development.
PostgreSQL Was the Obvious Choice for Gilt
From 2008 to June 2009, Gilt’s membership grew from 50,000 to more than one million members. As a result of this explosive growth, our databases began to collect an immense amount of data related to our customers and products. Replication became a core part of our strategy, and we reached out to the community for help. We joined other companies in sponsoring Hot Standby, a key feature developed by 2ndQuadrant that enables true replication by making it possible to read from multiple slave servers. Hot Standby debuted in PostgreSQL 9.0 (released in 2010) and by taking advantage of this incredibly useful tool we have since very successfully scaled PostgreSQL horizontally. 
PostgreSQL at Gilt Today
As Gilt’s phenomenal growth has continued, our data infrastructure has grown accordingly. Today we max at around 6,000 database transactions per minute. The primary instance of our database has grown to 800 Gb. We manage multiple terabytes of data in more than 50 unique production PostgreSQL databases. A small number of in-house and third-party experts maintain these databases. Gilt’s engineering team is organized non-hierarchically into small decentralized teams, and each of these teams is responsible for developing its own applications and micro-services, as well as for managing its own databases. Both performance and administration of PostgreSQL have been fantastic.
Giving Back to the PostgreSQL Community
In addition to sponsoring Hot Standby, Gilt has aimed to grow and support the PostgreSQL community in many other ways. Gilt co-founder and CTO Michael Bryzek created an open-source schema upgrade mechanism for PostgreSQL that makes it very simple for engineers to contribute schema changes to a PostgreSQL database–managing the schema evolutions as proper source code. Bryzek and other members of the Gilt engineering team have given presentations on PostgreSQL and Docker and other topics at PostgreSQL conferences and meetups. Gilt financially sponsors and participates in PostgreSQL conferences such as PGConf.EU and PGConf NYC, and will continue to look for new and innovative ways to help this dynamic community! 
(If you’re interested in working with Postgres at Gilt, check out our Big Data Administrator position!)

---
layout: post
title: Riak Passes the Stress Test
date: '2013-07-15T14:41:00-04:00'
tags:
- splitter
- zeusbench
- Riak
- Gilttech
- Dublin
- RabbitMQ
- Basho
- cake pattern
- Jim Englert
- Riakathon
- gilt
- Seth Thomas
- Steve Vinoski
tumblr_url: http://tech.gilt.com/post/55529520304/riak-passes-the-stress-test
---

In late June a few of us in NYC joined our colleagues in Gilt’s Dublin office to test out Riak for our main user store. Every day our main user store receives upwards of 100,000 requests per minute at our peak site traffic time of 12PM. Because of these extreme traffic spikes, excellent performance of our distributed databases is a must.
We also wanted to learn more about how Riak supported multiple data centers (including EC2) in an active-active-active configuration: a mechanism that guarantees continuous service in the event a database goes down. Active-active-active configurations also allow requests to be serviced in any datacenter without requiring the request to leave the data center to retrieve user information. These capabilities are quite important to Gilt, because network connections between datacenters are never as fast as those located within a single datacenter.
On the hardware side, our plan was to install two rings, each consisting of five servers, in different datacenters, and then completely run Riak through the gauntlet. We had only one week to create this system. Luckily, we had the best help imaginable: Seth Thomas and Steve Vinoski from Basho, the company that created Riak.
Riak passed all of our tests with high marks, and also performed well during various failure scenarios we staged.
In terms of the actual testing, our goal was to duplicate our user service and point it at a Riak datastore instead of our current datastore. This, of course, required altering the service code. I’m not a big fan of the cake pattern, which in my experience results in obfuscated code, but I have to admit that–at least in this case–it simplified the code rework and made the code cleaner.
After using Riak to duplicate our user service, our next step was to write some code to copy our existing users’ information to the new Riak backend. The speed of our current infrastructure enabled us to copy our entire user set to Riak during non-peak hours.
Once we had everything humming in our cluster of user services and Riak instance, we began simulating reads and writes to the service as they occurred in production. To do this, we used splitter: an open source project, created by Gilt VP Architecture Eric Bowman, that accepts requests and forwards them to two different backends. One of the responses is kept, and the other is discarded. In this case we discarded the Riak response. We then configured our load balance (Zeus) to forward requests to the splitter instead of directly to the service. This put read traffic on our test user service.
To simulate write traffic, we wrote a small bit of code to publish RabbitMQ messages any time a write or update occurred; consumed those messages on the test user service; and duplicated the write or update. Read-and-writes were now being executed against the test service cluster without putting our production system in any real danger. Testing looked good so far.
To really make sure Riak was as solid as it seemed, we then decided to ramp up the read/write load. We simulated an extreme read load by using Zeusbench, which executed an extreme number of HTTP requests against our test service and provided metrics on how the service performed (you can find a number of open source alternatives to Zeusbench).  We also wrote a quick program that executed upwards of 1,500 insertions into Riak per second.  We kept the inserts going the entire time.  Read/write performance didn’t suffer, even under this amount of load.
Our final test involved kill -9’ing Riak nodes and monitoring how the cluster performed.  While removing Riak nodes, we maintained production load against the service. Riak performed well during these situations.
Riak’s strong performance suggests that, should we pursue implementation, it will withstand our unique traffic needs and prove reliable. As for the Gilt-Basho team’s strong performance: It was amazing that we were able to accomplish so much in just a week’s time! Thanks again to Seth and Steve for making this possible.

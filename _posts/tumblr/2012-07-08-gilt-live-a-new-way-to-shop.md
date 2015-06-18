---
layout: post
title: 'Gilt Live: A New Way to Shop'
date: '2012-07-08T21:49:00-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/26801428997/gilt-live-a-new-way-to-shop
---
Gilt Live is a new way to shop on Gilt.  It gives you the chance to see what our members are buying on Gilt - right now.  We are excited because it gives you a way to discover new products that you might never have seen.  And since it is updating in real-time you can see something sell out right before your eyes –- or not if you are quick enough to jump on it.

The Technology
Gilt Live is Gilt’s first public facing application to use websockets. Why websockets?  The key component of Live is the ability to send real-time messages to our members. Websockets are the perfect candidate.
Live is written in Scala on the Play 2.0.1 framework and uses Akka for thread management, a decision based on the the framework’s scalability and websocket integration approach.
What is Supported?
Websockets are only supported in Firefox 11+, Chrome 6.0+, Safari 5.0.1+ and Internet Explorer 10.0. This does exclude a set of users from the experience, and it is a drawback, but we feel the benefits outweigh the loss.
The Client
The client uses the jQuery Isotope library to render the product messages in a multi-size, dynamic layout. In order to prevent an excessive number of products in the browser and save CPU resources on the client’s machine, the client removes the top unseen products from the DOM, a process we call “Chunking” – after our favorite character from Goonies.
Load Balancing
Live uses the Zeus load balancer. Initial load testing allowed for only 500 concurrent connections, but after a few configuration tweaks, we have reached over 28K concurrent connections and counting!
Inventory Updates
One of the coolest features of live is our inventory updates, made possible through the use of websockets. If there are 5 or fewer items left to buy, you’ll see a countdown flag on the product, and if you stay around, you’ll see the count drop from 5 units, to 4…to Sold out!

Summary
We’ve learned new technologies, faced scalability challenges, and most importantly had fun through the development of Live. We are already forming ideas to take live to the next level and use websockets in other areas of the site.
Thanks for reading, and let us know if you have any suggestions!

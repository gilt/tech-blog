---
layout: post
title: no title
date: '2011-04-14T17:42:58-04:00'
tags:
- frontend
- javascript
- coffeescript
- codeconf
- charlie_sheen
tumblr_url: http://tech.gilt.com/post/4615488811/codeconf-lightning-talk
---
At CodeConf, I gave a quick lightning talk about one of the products of our recent Hackathon.
It turns out, naming things is really hard (one of the two hard things in computer science). When we went to name our project, pressed for time, we went for the most topical thing we could think of at the time. Thus, charlie_sheen_service was released to production at about 1 am.
charlie_sheen_service has one endpoint, blather that is a live feed of orders with some MSA data.
The service is polled by it’s one client, Warlock. Warlock is a map that displays the orders as the come in real-time. A marker shows where orders are coming from on the map, and as more come in the radius of the marker expands. As the average price of that MSA increase, the color of the marker changes. Images of the products are spewed forth from the map as they come in. The whole thing is winning.
Warlock is built in CoffeeScript and a great JS library called Polymaps.
It’s often displayed on a large monitor in our office.

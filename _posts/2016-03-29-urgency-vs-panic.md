---
layout: post
title: Urgency vs. Panic
author: Hilah Almog
date: '2016-03-29'
categories: 'tech blog'
tags:
- KPI
- urgency
- panic
- shopping
---
## Urgency vs. Panic

My first initiative as a product manager at Gilt was something called “Urgency”. It was formed under the premise that Gilt customers had become numb to the flash model, and we in tech could find ways to reinvigorate the sense of urgency that once existed while shopping at Gilt; the noon rush wherein products were flying off the virtual shelves, and customers knew if they liked something they had precious few minutes to purchase it before it’d be gone forever.
I came into this initiative not only new to Gilt but also new to e-commerce, and I felt an acute sensitivity towards the customer.At Gilt we walk a fine line between creating urgency and inciting panic, and it's something I personally grappled with continuously. The former’s outcome is positive, the shopping experience becomes gamified, and the customer’s win is also ours. The latter’s outcome is negative. The customer has a stressful and unsuccessful shopping experience, and then churns.
This fine line meant that we as a team couldn’t just conceive of features, we also had to find the perfect logical balance as to when they should appear – and more importantly, when they shouldn’t.


###  Cart Reservation Time

Our first feature was reducing the customer’s reservation time by half once they add a product to their cart. This tested well, but felt mean. We therefore held its release until we could build a product marketing campaign around it that communicated the shorter time as an effort in fairness: "if other customers can’t hoard without real intention to buy, then you get the most coveted products faster". The customer service calls ended once our shoppers felt the feature was for their protection, not harm.


### Live Inventory Badging

We wanted to continue running with this theme of helpful urgency, leading us to our second feature: live inventory badges. When we have less than 3 of any given item, a gold badge appears atop the product image saying “Only 3 Left”. It then animates in real time as inventory of that item changes. If you are ever on Gilt right at noon, notice how our sales come alive through these badges. Unlike the cart reservation time, this feature felt like a one-two punch. Not only were we creating urgency, but we were also giving the customer something they rarely get while shopping online – a view of the store shelf.
   

<p align="center">
  <img src="http://i.imgur.com/4dMJ6ii.png"/>
</p>

<p align="center">
  <img src="http://i.imgur.com/1Um0icn.png"/>
</p>

### Timer in Nav + Alerts 

Our third feature was our biggest challenge with regard to striking the right balance between urgency and panic. We added a persistent cart timer in the navigation, showing how much of your aforementioned five-minute reservation had transpired. The timer’s partner in crime is an alert, in the form of a banner, that appears on the bottom of the page when only a minute is left on your item’s reservation, urging you to checkout before it’s gone.

<p align="center">
  <img src="http://i.imgur.com/26xUO6p.jpg"/>
</p>

In order to find ourselves on the right side of the line, we implemented stringent rules around when this banner could appear, limiting it only to products that are low inventory (less than 3 in your size), and once per session.
        	
### Live Views

We faced an altogether different challenge when it came to our final feature, live product views. Here, the feature itself wasn’t strong enough, the views had to carry their weight. We again were forced to think through very specific thresholds depending on inventory levels and view count in order to determine under what circumstances we show, and under which we hide the feature.

<p align="center">
  <img src="http://i.imgur.com/YoQXYYe.png"/>
</p>

Each of these features were tested individually, and each yielded positive results. After each was released we saw a combined 4% increase in our Key Performance Indicators on revenue within the first hour of a sale. The line was traversed successfully without panic but with the intended effect. And to our customers we say; *Because you're mine, I walk the line*.
 

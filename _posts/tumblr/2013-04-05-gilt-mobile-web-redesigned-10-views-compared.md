---
layout: post
title: Gilt Mobile Web Redesigned - 10 Views Compared
date: '2013-04-05T15:54:00-04:00'
tags:
- mobile
- gilt
- gilttech
- ios
- web development
- UX
- user experience
- Gregory Mazurek
- redesigns
- apps
- Gilt mobile web
tumblr_url: http://tech.gilt.com/post/47211899408/gilt-mobile-web-redesigned-10-views-compared
---
Over the last three months, we overhauled the front end (JSP, HTML, Handlebars, LESS/CSS, JavaScript, Zepto) for Gilt’s mobile web experience (http://m.gilt.com). The redesign was inspired by learnings acquired from our iPhone App and the design is meant to replicate a lot of those features.
Here are 10 side by side comparisons with notes inline and at the bottom. Let us know what you think!

In the previous design, there was an assumption that the Gilt shopper uses the mobile experience quickly and wants to see as many sales as possible in a short amount of space and time. But according to our iPhone App results, our users want to see larger pictures. Having two sales on the first view compared to four has resulted in increased sales, largely due to our amazing imagery.


We dropped the black background on the product details because most of our imagery adopted a white background.


A nice feature of the redesign is that the add to cart button is visible on the bottom while scrolling on the product detail page. If you are shopping on m.gilt.com and want to purchase an item, you should have the add to cart accessible at all times. But, this doesn’t always work on all devices.


We created a more streamlined view for our sign in and registration pages by simplifying the experience.


Our cart page features a similar button to what existed on the product detail page. Again, we are trying to make it as easy as possible to shop on a mobile device.


The checkout experience mimics the iPhone App experience while trying to keep a style that is more generic so that it looks great on Android as well.


While scrolling to the bottom of the checkout page, the submit order button stays fixed. In our older version, the user had to scroll to the button to checkout.


We are reusing elements in our account page that we used in the checkout flow.


Our footer introduces more spacing as well as elements that were previously found in the checkout and account flow.


We have an amazing customer service team.

Here are 5 learnings from redesigning the Gilt Mobile Web experience.1. Visual Components: Abstract away visual components that can be reused throughout the mobile experience. For example, the buttons in the footer are also used in the account page as well as in checkout. We only need to supply text and an optional image to create one.2. Cross-Browser Compatibility: Handle browser-specific issues like fixed-positioning on a per-device basis. The fixed “submit button” appears at the bottom of the screen on the product detail page, cart, and checkout page for modern browsers. But for early versions of Android, for example, the buttons appear inline.3. Iterating: Gilt Mobile Web is a complete experience in that it includes everything from the sales listing page through account and checkout. When trying to roll releases out to production, we searched for places where the old and new designs could coexist for a limited period of time. With this strategy, we didn’t have to redesign everything at once.4. Cross-Device Compatibility: We tested m.gilt.com against several android and apple devices (as well as ie6 and ie7) to make sure it looked good on many different screen sizes. In many instances, DOM element sizes are determined as a percentage of the viewable screen. But since the majority of our users are accessing us from Safari on iPhone, development starts on the iOS Simulator.5. If it doesn’t work, roll it back: I deployed our second phase to production and immediately upon doing so realized that “sold out” hover states were not… hovering. It was something that we missed and instead of making a quick fix, we rolled it back and spent a little more time testing. We pushed to production again a few days later with bug fixes in place and confidence that the experience was stable. Sometimes, we can’t catch it all on staging environments.

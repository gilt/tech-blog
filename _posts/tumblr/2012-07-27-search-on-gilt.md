---
layout: post
title: Search on Gilt
date: '2012-07-27T14:01:00-04:00'
tags:
- solr
- scala
- PlayFramework
- backbone.js
- Gilt
- gilttech
- search
- customer experience
- lucene
- autosuggest
- autosuggestion
- real-time
- Adrian Trenaman
- Mark Wunsch
tumblr_url: http://tech.gilt.com/post/28137272630/search-on-gilt
---
Some of our users may have noticed a new and welcome addition to Gilt over the last few weeks—we’ve rolled out search across our Women’s, Men’s, Kids and Home stores! In Gilt Tech, we know how much our members love the thrill of the hunt when our sales go live every day; and, as a tech team, we’ve always felt good about building our site to drive a great flash-sale shopping experience. However, we also felt strongly about providing a way for letting our members find the gorgeous stuff they love faster. With this in mind, we’ve built out our keyword search using Scala, Play Framework and Apache Solr / Lucene, and have learnt a huge amount of stuff along the way.

First: a tour. If you’re one of the lucky few in our A/B test group, you’ll see the ‘magnifying glass’ search control on the top right of your screen, just below your cart / checkout:



Click on the magnifying glass, and you’ll see our search box playfully swish out; you can select a store to search and then type away happily. We autosuggest on our favorite brands, colors and all of our live sale products. You can then filter by category, brand, size and color using the facet controls on the left to find exactly what you want.



Implementing search for a flash-sales business, where inventory is limited and changes rapidly as our sales go live to a stampede of members every noon, poses a number of technical challenges: with small numbers of fast-moving inventory, we’re keen to make sure that the search results you see are genuinely the products that we have to sell at the moment you search. To make it work, we index our live products using Apache Solr, and sort and filter search results with real-time inventory status using a set of custom Solr extensions.

The search listing page is implemented in Scala using Play Framework. We’re loving Scala at Gilt, and while our growing corpus of Scala code plays very nicely with our existing Java infrastructure, it made sense to take a look at Play Framework as a new platform for Scala-based web-apps. Regular readers of the Gilt Tech blog will have seen how the Gilt Live team recently released an awesome social shopping experience using Play Framework and Web Sockets. For Search, we use Play’s templating language to render our initial listings from the client-side, and then use a combination of Backbone.js and Handlebars to handle the subsequent AJAX rendering within the browser on the client-side. The result is super fast! We found the Play stack fun and easy to use; so much so that we had time to implement some really neat features: for example, when you hover over the Next or Previous page links on a listing, we preemptively initiate a request so that the data is already there for you if you decide to click.

We feel really good about the solution, and we’re seeing our members respond really well to the feature! Happily, we have lots of great ideas and are going to continue to iterate on the experience.



We hope you like it as much as we do!

Adrian Trenaman, Mark WunschTeam Galactus, Gilt Tech

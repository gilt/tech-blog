---
layout: post
title: Product Recommendations at Gilt
date: '2011-06-06T12:12:00-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/6251275107/product-recommendations-at-gilt
---
Product recommendations at Gilt work a little differently than they do at other companies.  For example, at Amazon they enjoy the benefit of having a relatively static and large inventory so they can do things like collaborative filter – where you can recommend a product based on what other people have bought or looked at. Gilt is unique because our inventory is in constant flux. The products we have one week are gone the next and there is a chance we won’t have them again.
 
At Gilt, we’ve employed a technique called contextual retrieval. Contextual retrieval is a search method where we take elements from the user context to help them conduct a search. When someone sees a product that is sold out and they decide to waitlist it, we can infer a lot of things about the user. One is that they really want that product. Another is that we know everything about the product they are interested in. In fact, we use that product as a search query to find related ones that we have in our inventory whether they are currently on sale or not.

So the steps involved in setting up a contextual retrieval based recommendation service are as follows:
·      First, you are going to have to create a search index of your products.  Apache Lucene is a great piece of open source technology for doing just that. You are going to want to create an index that contains all the fields that you have describing your products. Those fields are basically the metadata that you need to find similar ones.
·      The second step is search query manufacturing. This is where the recommendation magic really happens. When you construct your search from a product, not all fields are going to be equally important. In fact, it is very likely that different genres of products will have different fields that are going to be more valuable than others. To that end, you need to devise a weighting scheme where you boost the value of some fields over others.
·      The third step is caching those recommendations.  You can quite easily get away with caching all your recommendations because unlike a search engine, you already know all the search queries that you are going to encounter – they are the products you have for sale. At Gilt, since we have new products every day, we generate and cache our recommendations once a day.
·      The fourth (and most rewarding) step is using those recommendations in ways to help your users.  One of our customer pain points is that the product at Gilt sells out quickly.  When a user has decided that they want an item so much that they are willing to sign up for it on a waitlist, we want to do everything in our power to try to find them another product that they will be happy with.
That’s pretty much what we aim to achieve at Gilt – Simple, Fast and Fun!

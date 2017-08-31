---
layout: post
title: "Team Rookie 2017"
author: Team Rookie
date: '2017-8-30'
categories: 'internship'
tags:
- internship
- web
- team rookie
---

# Who We Are

<p align="center">
<img src="/assets/images/team-rookie-2017/team.png" width="940" />
</p>

Team-Rookie-2017, as we pride ourselves with being the most awesome team ever, has spent the summer creating an experience for Gilt users to improve their browsing experience as well as to collect data for our personalization team. The end result of our project included the crafted front-end user experience and a back-end service for data processing.


After our brief introduction to software development at Gilt, we started on a project of our own. Our mentors introduced us to Agile sprints, and we were off. Our progress was slow at first, but kicked up near the end, and on the last day of development we finally got our finished app deployed.

# Project Ideation
The final project idea rose to the top through countless meetings and discussions with various teams in the organization. With the initially decided problem-solution proven to be unexecutable, our team, along with all of our mentors, took efforts to come up with a new solution to solve the given problem with the limited resource we had. This immersive process, in the very beginning of the program, ensured the understanding of the engineering problem and established the success of our project.

During this problem-solving phase, Team-Rookie also spent time in parallel to understand the technology stack in order to come up with the best solution possible. We went through many tutorials and labs with our mentors on the technologies we were going to eventually use, namely Scala, Android, and the Play framework. As we gained familiarities with these tools and technologies daily, the design of our solution became clearer and clearer and we were quickly able to finalize on our ideas and the project has finally taken off.

# Problem Space:

So let’s talk about what the problem actually is. With a growing user base, the Gilt platform needs to better understand what the users’ interests are in order to tailor their shopping experiences. However, the lack of user preference data is preventing us from doing so. Currently, users are able to “shop-the-look.” This feature allows a user to browse a completed set of apparels, such as the combination of a shirt, a pair of jeans, and shoes. This is a pretty cool feature. It rids the hassle of a lot of users having to purchase these items separately, so why not just buy them all at once? Well, for this to actually work, they have to be good, and that’s the bottom line. At the moment, these completed looks are designed by stylists who understand them, and they are backed by professional opinions. Okay, they are good. But we don’t have that many stylists everyday sitting there and picking out dresses for this ONE feature - that would be really inefficient wouldn’t it? Fashion trends change, and so do the looks. These looks need to be constantly updated in order to stay good. To maximize sales, we want to have a lot of these looks, and we want them to be updated with the fashion trends. To achieve this, some data need to be collected. We want to collect enough data on what the users like and don’t like, so we can actually generate these completed looks without the aid of a stylist. This is an ambitious goal, but not unachievable. We just need to collect a lot of data.


# Solution:

Now that we know what the problem is, a solution needs to be devised. The solution that team-rookie and the mentors came up with, is to create a fun and engaging experience for the users while they are shopping: completing their own outfits. One key requirement for this experience is that it can not interfere with the current purchase flow, meaning that if a user is closing in on a purchase, that process should not be interrupted. If a user visits our platform, they will likely browse the catalog for what they are looking for. This could be a dress, a shirt, etc. Currently, there is a feature on Gilt which allows users to favorite items they like without buying it, shown in the figure below.


<p align="center">
<img src="/assets/images/team-rookie-2017/web-search.png" width="940"/>
</p>

For our experience, to minimize disruption to the current workflow, we’ve added an additional hover link on the favorite button, and this will direct the users to our long awaited “experience.”

<p align="center">
<img src="/assets/images/team-rookie-2017/favorite.png" width="940"/>
</p>

The experience, a.k.a our solution, provides the user with additional items that can potentially be paired with the initial favorited item to form completed looks. These products, limited by category and price based on the initial favorited items, will be presented to the users for individual selections. The users can let their imaginations go wild and pick what they think are the best combinations. During this process, we will collected this user preference data and persist it through our back-end API to the database.

<p align="center">
<img src="/assets/images/team-rookie-2017/first_page.png" width="940"/>
</p>

As of this point, if the user has made it this far, our purpose has been completed. They have given us the data we need. However, the feature is not yet complete. In order to complete the experience and make it as engaging as possible, we’ve decided to allow the users to immediately purchase the selected items if they wish. Since these items are what they specifically picked out from a pool of products, they will have a bigger likelihood for conversion.

<p align="center">
<img src="/assets/images/team-rookie-2017/second_page.png" width="940"/>
</p>

So in a nutshell, this is the completed project of the 10 week internship filled with hard work, grind, sweat (most from our daily trips to equinox right down stairs), and a whole lot of fun.


# Intern Activities

While we are not busy being awesome engineers, team-rookie spent most of their leisure time exploring New York and staying cool. Here are some of the highlights.

<p align="center">
<img src="/assets/images/team-rookie-2017/pose.jpg" width="940"/>
</p>

<p align="center">
<img src="/assets/images/team-rookie-2017/poke.jpg" width="940"/>
</p>

<p align="center">
<img src="/assets/images/team-rookie-2017/wonderwoman.jpg" width="940"/>
</p>

<p align="center">
<img src="/assets/images/team-rookie-2017/dessert.png" width="940"/>
</p>

<p align="center">
<img src="/assets/images/team-rookie-2017/helmets.jpg" width="940"/>
</p>

<p align="center">
<img src="/assets/images/team-rookie-2017/presentation.jpg" width="940"/>
</p>

# Mentorship

Team Rookie would like to give out a huge shout out to all of our mentors that helped us along they way and made this project possible (you know who you are)! With a special thanks to Doochan and Mike, who led the intern committee through all of our battles and came out on the other end with a solid victory. The complete-the-look experience would not have been possible without you guys.

<p align="center">
<img src="/assets/images/team-rookie-2017/doochan.jpg" width="940"/>
</p>

<p align="center">
<img src="/assets/images/team-rookie-2017/mike.jpg" width="940"/>
</p>

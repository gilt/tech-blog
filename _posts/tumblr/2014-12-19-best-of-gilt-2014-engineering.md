---
layout: post
title: 'Best of Gilt 2014: Engineering'
date: '2014-12-19T13:54:00-05:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- software engineering
- Best of 2014
- open source
- opensource
- Architecture Summit
- Android-Proguard-Snippets
- Gilt GitHub page
- Mockingbird
- sbt-dependency-graph-sugar
- Scala
- Play Framework
- apidoc
- Amazon Web Services
- AWS
- Anthony Manfredi
- CAVE
- Val Dumitrescu
- Pawel Raszewski
- InfluxDB
- Amazon Kinesis
- RDS
- A/B testing
- Young Moon
- Erik Lumer
- GitHub
- bestof2014
tumblr_url: http://tech.gilt.com/post/105622760239/best-of-gilt-2014-engineering
---
Over the next few days we’ll be recapping some of the #gilttech team’s favorite and most significant tech developments of 2014. To kick things off, here are some of the highlights of our engineering work this year.
We Upped Our Commitment to Open Source
At our Architecture Summit in February, our engineering team coalesced around the goals of incorporating more open source tools into our work and increasing our contributions to the OS community. Since then we’ve added dozens of new projects to our team GitHub page (you’ll learn about several of them in more detail below), revised our OS guidelines to simplify the release process for our engineers, and formed a working group to strengthen our OS culture internally. Several of our team’s OS projects–Android-Proguard-Snippets, Mockingbird (iOS), and sbt-dependency-graph-sugar (Scala)–have generated lots of excitement in their respective communities, which we appreciate.
apidoc
Built by the Gilt engineering team, apidoc is a lovingly crafted open source project that enables you to build beautiful documentation for REST services. With apidoc, you can download native client libraries with no (or almost no) dependencies. Its intuitive JSON format is easy to navigate, which makes it fun to use. Check out the apidoc to-do list and contribute to this project, which you’ll hear more about in 2015.
AWS at Gilt
This year we started using AWS in order to reduce the effort spent managing physical hardware. Now our engineers can get a server with a simple click of a button. AWS aligns with our goal to make software engineering as simple, scalable and empowering as possible. “AWS enabled me to set up a fault-tolerant Elasticsearch cluster in a single afternoon,” says Senior Software Engineer Anthony Manfredi.
CAVE
 
Begun in earnest this year, CAVE stands for “continuous audit vault enterprise.” Not sure what that means? Here’s another description: CAVE is an open-source managed service for monitoring infrastructure, platform, and application metrics. Largely the work of Gilt Senior Software Engineer Val Dumitrescu and Software Engineer Pawel Raszewski, and built in Scala, CAVE combines InfluxDB, Kinesis, Amazon RDS, and other great technologies to provide visibility into your system’s performance and operational levels. Learn more about it by reviewing the above slideshow.
Gilt’s Custom A/B Testing Platform
A/B testing is core to Gilt’s product development methodology. It informs our decision-making and gives us insight into what’s working and what’s not. The A/B testing system we used to use wasn’t able to scale as we grew–it essentially limited our platform to 64 test variants max. This created a situation in which we began to work on way more products than that platform could handle. To remedy this, Gilt Lead Software Engineer Young Moon and VP of Personalization Erik Lumer worked together to build a completely new platform that allows for a nearly limitless number of concurrent tests for our product development purposes. 
We Went Responsive


The Special Operations Team led the charge in responsivizing Gilt’s website to mobile devices–then generated massive amounts of interest in their work via tech talks, articles and social media outreach. Check out their blog posts on writing in-selector CSS media-queries instead of blocks, using Selenium-automated tests for responsive pages, and the full-screen modal.
GitHub
This year we began to shift away from having an internal continuous integration setup infrastructure toward leveraging the open source tooling built around GitHub. Moving in this direction allows us to experiment with third-party software and open source tools that integrate with GitHub, such as Travis CI and Circle CI.
Estimated Delivery Windows
Over the summer, our Program Management Organization and Back Office team huddled in a room to dissect Gilt’s architecture around product delivery windows. Their goals: perfecting the service that estimates how much time it takes for a customer to receive their Gilt purchase; make it easier to deploy changes to this service to production; and simplify our delivery window calculation. Their results: Better engineering around this core Gilt function, and better results for our customers.
Docker

“A thing must produce a Docker image to be deployed somewhere” became a standard for our engineering team this year. Adopting Docker has empowered our engineering team to experiment with new technologies quickly and easily, giving us the freedom to take more risks and diversify our stack without inducing headaches. One example: Our team has instrumented Play Framework in our tooling, but some of our engineers have recently begun building apps in Node.js. Without Docker, we wouldn’t be able to add these Node apps without plumbing the concept of Node throughout our infrastructure; now, a Node app is just another Docker image. Docker has also enabled our migration to Amazon Web Services. Throughout the year we shared our excitement about Docker with the larger tech community by hosting (crowded!) meetups in NYC and Dublin, sharing our story at the first-ever DockerCon in San Francisco and wearing our Docker swag with pride.
HighJump
Our distro engineering and applications support teams engineered the launch of this new warehouse management system in June. HighJump gives us the ability to lower our software CPU costs, manage inventory more efficiently, establish functional parity across all of our distributions centers (i.e., the places where we store and ship out inventory) and generate a global view of our physical inventory within our WMS. 
Avro, gfc-avro, and BlueSteel

Image by Weeping-Willow Photography.
The Gilt engineering team (especially Principal Data Engineer Michael Hansen) has been using the open source data serialization framework Apache Avro along with Kafka and HDFS to manage our real-time (or near real-time) data capturing. For projects based on Scala, the Avro framework is not as friendly to use as you might hope. To address this, we created gfc-avro: An Avro library in Scala base on Scala pickling. gfc-avro supports the conversion of case classes to Avro records or schema definitions. On the mobile site, Senior Software Engineer Matt Isaacs has been working on BlueSteel: an Avro encoding/decoding library for Swift. Both gfc-avro and BlueSteel are looking for contributors–ping Matt if you want to get involved.
Product Look Link
In October, we launched a new feature that enables Gilt’s stylist to link accessories and other clothing included in each photo. This will allow us to showcase completely shoppable looks.
We Play-ed Hard
Our engineers made substantial progress in rolling out Play Framework across all parts of our website. Part of our work building a microservices architecture has involved breaking up all of our pages from one monolithic app into smaller Play apps, each owned by different teams. As Scala users, we’ve become very familiar with Play and love working with it–it’s contributed greatly to our Developer Happiness KPI. With Play, site releases and eliminating dependencies is easy, and the framework scales very well for tech organizations like ours that like to move fast. Check out Senior Software Engineer Giancarlo Silvestrin’s Typesafe webinar on Play (above) to learn more about our work.
We Built a Native Android App
We released our very first native Android app to our millions of users in November, after establishing an Android team. We’ve seen the growth of Android over time and we wanted to give those users a much better customer experience. Our Android engineers have taken a heavily test-driven approach to building the application, laying a solid foundation for future expansion. They also took advantage of the many great open source tools available to Android devs, such as Volley, Butter Knife, and Joda-Time. Customers can expect to see many new features next year, and our team will be releasing several open source libraries in early 2015.
Photo Shoot App
In February, we launched a new Photo Shoot application that eliminated much of the manual process for styling and shooting product looks. By putting the process into our system, we were able to completely eliminate a lot of the manual work involved in styling, shooting, and processing images. This gives our stylists and creative talent more time to do what they do best: create compelling photography to sell our products.

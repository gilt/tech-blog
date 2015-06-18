---
layout: post
title: The Gilt Personalization Team's "Best of" List for 2014
date: '2014-12-19T17:38:00-05:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- machine learning
- Will Chiong
- Zachary Cohn
- Scott Thompson
- Brian Ballantine
- Coursera
- Apache Spark
- Spark 1.0
- facial recognition
- DeepID2+
- GaussianFace
- Google
- Google Predictor API
- KMeans clustering
- MLib
- Erik Lumer
- Paul Dix
- InfluxDB
- Spotify
- Top Tracks in Your Network
- Deep Learning
- Clojure
- open source
- opensource
- ClojureScript
- Deeplearning4j
tumblr_url: http://tech.gilt.com/post/105638528524/the-gilt-personalization-teams-best-of-list-for
---
Not to be outdone by the Gilt Mobile team, the Gilt Personalization team also found time to share some of their favorite tools, tips and talks in this space. Read on (and check out their 2013 faves here):
Spark 1.0

In 2013 we listed the open source cluster-computing engine Spark as a great tool for getting started with parallel processing. This year, Spark reached version 1.0. With this major release, the developers behind Spark also bundled MLib in with the core framework–providing machine learning algorithms out of the box and making the linear regression algorithm easier to run than ever. Other Spark 1.0 algorithms that Gilt’s tech team uses are PCA (for pre-processing the data), collaborative filtering (for brand recommendations) and KMeans clustering (to segment our audience). Although there are still some rough spots–for example, PCA is still not fully parallelized–this release is a big step towards making scalable machine learning accessible for all. – Scott Thompson, Software Engineer
Facial recognition
Computer vision keeps getting better at facial and image recognition, and the most recent incremental improvements have finally pushed the machines above their main competitor–humans. A number of approaches now show that level of performance; GaussianFace, which is based on a Discriminative Gaussian Process Latent Variable Model, caught my eye earlier this year, and DeepID2+–released just this month–advanced the top of the leaderboard. From a different perspective, Google “solved” its own recaptcha task and is now moving away from recognizing numbers in signs toward comparing images in different contexts–something it’s also hoping to improve from an algorithmic perspective. Although humans remain far superior at answering questions around storytelling based on images, expect recognition of more complex contexts to be the next frontier. – Zachary Cohn, Machine Learning Specialist
Machine Learning as a Service
Machine learning as a service has seen a lot of growth, with several major tech players deciding to invest in this work and gain additional value from the products that they have developed in-house. Google’s Prediction API, IBM’s Watson, and Microsoft Azure ML have all made significant updates to their offerings this year–joining an already-crowded field of smaller providers hoping to capitalize on the growing democratization of “big data” platforms. More and more companies are finding themselves sitting on troves of data that they have no idea what to do with; why not experiment? How far these tools can go without having an expert to guide them remains to be seen–but as software and algorithms improve, much of what is hand-crafted today will be automated tomorrow. – Zachary Cohn
Machine Learning + Online Learning = Easy Learning
The number of online resources that will help you acquire knowledge and skills related to machine learning and big data continues to grow. On Coursera, you can enroll in free intro to machine learning classes taught by Coursera cofounder/Stanford professor Andrew Ng or University of Washington professor Pedro Domingos; learn R, data analysis, and other relevant topics through Johns Hopkins University’s 10 different courses; master data mining and analysis through the University of Illinois’ track, and more (new classes are posted all the time). Other online resources include Udacity’s affordable machine learning course with Stanford prof/Udacity founder Sebastian Thrun; DataCamp’s data analyst classes; Stanford’s free CS 229 Machine Learning course; and the seemingly endless number of informative articles, slideshows, and recorded talks you can find just by conducting a simple Google search. Mix and match and see what you learn. – Lauri Apple, Tech Evangelist
Evangelizing Machine Learning at Gilt

Gilt VP Personalization Erik Lumer kicked things off in this vein in January by presenting a talk for NYC Machine Learning–the huge machine learning-oriented meetup group co-organized by InfluxDB CEO Paul Dix and Palantir engineer Max Kesin. In May, Lead Software Engineer Will Chiong presented a talk for the Full-Stack Engineering meetup on how we analyze customer behavior data to make recommendations. In August, Gilt Tech’s Dublin team hosted a free Machine Learning course taught by University College Dublin professor/expert Padraig Cunningham. We also expanded our personalization team by several members–adding our first machine learning specialist and several engineers. – Lauri Apple
Spotify’s “Top Tracks in Your Network”


Earlier this month Spotify released Top Tracks in Your Network–a new feature that enables you to learn which specific songs are most popular with your friends. Using algorithmic magic, Spotify generates a “Billboard Hot 100” just for you, based on the songs your friends listen to most, and most often. This feature will be particular ideal for anyone whose friends are open to discovering new music and/or have great taste, and through its inherent trend-revealing nature will also help you to better create appropriate playlists for your upcoming parties (assuming your friends on Facebook are the same people as your real-life friends, and not just a bunch of strangers you have randomly chosen to follow). – Lauri Apple
Deep Learning

Image from Deep Learning’s Twitter page
If you’ve followed machine learning news from this past year, you’ve no doubt heard of “deep learning.” Large tech companies like Google and Facebook are getting better than ever at detecting our faces in photos and recognizing voice commands, and the secret to these gains all stem from deep learning. Until this year, applying methods from deep learning has generally required expert-level knowledge in the subject. However, the developers from Skymind, a business intelligence and enterprise software firm based in San Francisco, have been working to simplify DL and make it more accessible by releasing Deeplearning4j: an open source framework written in Java. If you’re looking to experiment with the bleeding edge of machine learning, make sure to keep an eye on this project. –Scott Thompson
We Started Using Clojure (a Bit)

Gilt is primarily a Scala shop, but that doesn’t mean we’ve “clojed” the door to other languages. This year members of our personalization and mobile teams spent some time delving deeper into Clojure–forming a study group, checking out Clojure Koans and other online learning resources, and even releasing an open source project: Senior Software Engineer Matt Isaacs’ Gilt Chrome extension, written in ClojureScript. On the general functional programming side of things, Software Engineer Scott Thompson’s tips for boosting productivity with Lisp got the attention of Planet Clojure. And in August, our NYC office had the great pleasure to host a talk by David Nolen on immutability and the Clojure stack. – Lauri Apple
Hadoop 2.0 (YARN) Release
Hadoop’s long-awaited new resource manager holds the promise of allowing a much more diverse set of tasks on the platform–especially useful for managing diverse types of tasks on the same cluster. –Lauri Apple
Lead Software Engineer Brian Ballantine also had a few favorite items to share, but didn’t have time to write blurbs about them because he has twin babies:
1.0.0 release and rename/rebranding of Stream-Framework, an open source project by Thierry Schellenbach that enables you to build newsfeed and notification systems using Cassandra and/or Redis
Cognitech’s 2014 “state of Clojure and ClojureScript” survey showed that Clojure’s getting more and more popular.

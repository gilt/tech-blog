---
layout: post
title: "(Some of) the Gilt Personalization Team's Favorite Things of 2013"
date: '2013-12-19T17:12:00-05:00'
tags:
- Gilt
- gilttech
- best of 2013
- favorites
- personalization
- big data
- machine learning
- Will Chiong
- Untappd
- PredictionIO
- Scott Thompson
- Erik Lumer
- Mahout
- open source
- Yoshi Sugawara
- Apache Spark
- Storm
- Hadoop
- real-time analytics
- Nathan Marz
- Netflix
- Nicholas Mitchinson
- Netflix Profiles
- Giancarlo Silvestri
- Electric IMP
- Pinnocio
- Spotify Discover
- Spotify
- Scala
tumblr_url: http://tech.gilt.com/post/70523625969/some-of-the-gilt-personalization-teams-favorite
---
2013 was a banner year for Gilt’s personalization team. In addition to making headlines in September with the launch of personalized sales, the team grew, got around a bit, and worked on a variety of exciting initiatives–some of which we’re not quite ready to unveil. Look for some announcements in 2014!
Generally speaking, 2013 proved to be a breakthrough year for personalization and relevant technologies. Here are a few noteworthy personalization- and big data-related tools, apps, presentations and features that we recommend checking out:
“The Art of Personalization in a Flash Sale Business,” a Talk by Erik Lumer

Gilt VP Personalization Erik Lumer gives an expert’s-eye overview of personalization and how we do it Gilt: by generating individualized sales algorithmically based on shopping behavior and personal preferences (including past purchases and browsing, as well as the sales, sizes, categories, and brands that a member has engaged with most frequently). Have you ever thought about how many different interpretations one could assign to something as seemingly straightforward and mundane as “blue dress”? You will, after watching this thought-provoking talk. –Lauri Apple, Tech Evangelism Specialist
PredictionIO
PredictionIO is a customizable, open source machine learning server based on Scala–the language we use at Gilt. Created by TappingStone co-founder Simon Chan and a few other developers, it’s aimed at making it easier to create predictive features and apply other machine learning principles to data science projects. PredictionIO is built on Apache Mahout, the popular machine learning framework for building scalable machine learning libraries, and appears to remove a lot of the complexity involved in interacting with Mahout directly. It also provides several APIs, including engine-specific APIs for querying prediction results. –Scott Thompson, Software Engineer
Apache Spark
Want to get your feet wet in parallel processing without having to read lengthy documentation or endure tinkering with configuration? Apache Spark lets you do just that. This impatient developer was able to go from download to running the infamous word-count example in under an hour (most of the time was spent downloading). Spark promises to be faster than Hadoop, both in processing speed and development time. There’s an interactive shell, so you know it’s developer-friendly. Spark is widely used and has a large supporting community, with libraries written to support cool stuff like machine learning and analytics. And its primary API is written in Scala, so +1 there. –Yoshi Sugawara, Senior Software Engineer
New York Times Series: “On the Path to Personalization”
Mark Grey’s articles on the New York Times’ recommendation engine provide some fascinating insights into the paper of record’s recent personalization efforts–particularly the ways in which the Times is building its data modelling processes to accommodate for new algorithms and other as-yet-undetermined changes. His posts also serve as a succinct and accessible summary of the many challenges of adding a personalized aspect to an already existing product. How do you add value to the end user in the long term without disrupting their current experience–and, more importantly, how does that happen under the hood? These are also questions we ask ourselves every day (maybe you’d like to help us find the answers?). –Chester Dean, Program Manager
Spotify’s Discover

Whenever I need something to really help me focus on coding, I put on the headphones, set my chat status to “Do Not Disturb,” and get down to business. Before opening up my editor, I almost always check out Spotify’s Discover screen to find new music suggestions. I like Discover because it employs several different methods to provide me with a variety of recommendations. By telling me why it’s recommending a band or a song, it empowers me to make the final call. Should I listen to the Forgetters because I haven’t played them in a while? (Not today, guys.) Or should I try Deerhoof because I like Panda Bear and Blonde Redhead (why not?)? –Brian Ballantine, Lead Software Engineer
Google Now

I’ve been really intrigued by the recent improvements to Google’s Android dashboard, Google Now. My Google Now dashboard can now derive semantic information from my recent search history and surface extremely relevant content from all over the web in a concise summary to be displayed on mobile devices and tablets. For example, it can respond to the fact that I’ve recently shopped for headphones and looked up showtimes for the movie Gravity, and show me new content from all over the web that’s relevant to the intersection of those topics as well as those topics individually. –Will Chiong, Lead Software Engineer
Presentation: “Realtime Analytics With Storm and Hadoop,” a Talk by Nathan Marz
 
This year brought increased attention to (and interest in) real-time computation systems, especially those that provide real-time analytics for business cases where is not possible (or desirable) to wait for long batch processing systems. In this presentation, Storm creator Nathan Marz explains how his project promises to do for real-time processing what Hadoop did for batch processing. The recently released Storm 0.9 version makes Storm simpler to install and manage by providing a new pure Java transport mechanism and a new Log Viewer UI. –Giancarlo Silvestrin, Software Engineer
We are aligning our personalization platform architecture with the principles of the Lambda architecture that Marz champions here. Two principles underlie Marz’ proposal: 1) pre-compute everything to ensure consistent response times and 2) combine a batch data elaboration path for the bulk of the historical data (e.g., based on Hadoop) with a real-time path that consumes recent update data streams (e.g., based on Storm). –Erik Lumer, VP Personalization
Personalization in the Home

2013 will be remembered as the tipping-point year for reducing the barriers for building personalized hardware gadgets. Amazing platforms like Spark, Electric IMP and Pinnocio have done much to reduce the barriers in both prereq skills and costs, and have also greatly simplified the process for building Arduinos that can communicate wirelessly. I’m excited to see what 2014 brings–I predict the introduction of even more interesting ways to help big data enthusiasts process and aggregate all the data that these and other tools will generate. –Yoni Goldberg, Lead Software Engineer
Netflix

As an active–one might even say *overactive*–user, I’ve noticed that Netflix’s personalization features have had a substantial influence on my entertainment habits. Whether I’m looking for a movie, or a new TV show to binge-watch, I can always discover new, relevant content based on Netflix’s recommendations. The “Because you watched…” explanations are also useful in helping me to analyze my preferences and reasonably predict what to expect. In 2013, Netflix released yet another new helpful feature, Profiles, which provides user-specific personalization across shared accounts and also allows users to receive suggestions from friends. –Nicholas Mitchinson, Waterloo co-op intern
Untappd

We are big fans of Untappd, a social network for “checking into” beers. The Untappd team made some great interface changes this year that really highlight their app’s beer suggestion capabilities. Now you can receive beer suggestions based on similarity to beers that you’ve already rated highly, and on availability in your area. We’ve used Untappd to curate our beer offerings at 5@4 get-togethers, and I’ve also used it myself to try new brews. –Will Chiong, Lead Software Engineer

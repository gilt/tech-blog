---
layout: post
title: "Airing out a new job system"
author: Terry McCartan
date: '2018-03-05'
categories:
- data
- docker
- aws
tags:
- airflow
- aws
- tech
- data
- etl
- scheduling
---

# Airing out a new Job system

In this article I’ll be sharing some of the knowledge the Data team at Gilt picked up in replacing our old job system with Apache Airflow. 
We undertook the decision to overhaul our job orchestration system a few months ago due to a number of reason but have now successfully migrated all our data ingestion jobs to the new system.

Firstly a little bit about our team. The Data Team at Gilt is responsible for constructing, delivering, and supporting all systems and services which enable self-service analytics
and data science across all banners and all functions at Hudson's Bay Corp (HBC).
The scope of responsibilities begins with data ingestion, and ends with supporting our user community of BI tool uses and data scientists. 
These varieties of sources and types of processing lead us to review our job orchestration and I’ll be sharing the challenges involved, attempted solutions and lessons learned.

## In the beginning...

The Data team has various jobs that handle the ingestion of data from multiple sources in a variety of formats. 
Each of these sources have either strict integration guidelines regarding time of ingestion or require coordination between various jobs to ensure correct ingestion. 
This leads to numerous issues surrounding job scheduling, coordination and success criteria. We solved these issues with using our internally built job system [Sundial](https://github.com/gilt/sundial)

As times changed, we wanted to take a fresh approach to how jobs were provisioned from a AWS point of view. 
The jobs we use are lightweight and having them running on ECS instances around the clock when they were idle was deemed as a waste of resources. 
It made sense to us to move the jobs to AWS batch instances to limit the cost of running jobs while still maintaining all the benefits of ECS. 
This lead to some problems with our Sundial job system due to the fact that at the time it didn’t support AWS Batch. 
This has changed since then with some great work by our personalisation team which you can read more about [here](http://tech.hbc.com/2017-08-04-sundial-batch.html).

## Time for something new…

The team decided it was time to take a fresh approach to how we ran our jobs, which kicked off the investigation of a new system. 
The investigation took place over a few weeks and spanned across a number of open source solutions. 
We outlined that a new job system should at minimum support a number of features

* It should be able to integrate with AWS Batch
* Have a rich feature list inline with what was available in Sundial
* Have the ability to contribute new features and expand existing functionality
* Have the ability to have rich visualization of jobs and their dependencies

We were able to whittle down the numerous possibilities to three possible solutions. 
The first being Spotify's Luigi system, available [here](https://github.com/spotify/luigi) which is a really great solution and was ticking most of our boxes. 
We decided it was worthwhile to generate a proof of concept approach to really trial the solution. Luigi has been around for a long time and has rich user base which was a positive factor for us when considering it as our solution. 
It was a really close call between Luigi and the solution that we picked mainly because Luigi provides a lot of the features we are looking for. 

The second solution we investigated was LinkedIn's Azkaban workflow manager, available [here](https://github.com/azkaban/azkaban).
Being based in java was probably closer to our comfort zone which was a plus for this project.

What we found out was that although it satisfied our needs with regards rich visualization of the jobs and their dependencies there was some drawbacks to the solution. 
It seems to be solely focused on orchestrating hadoop based jobs while we require a solution that allows us to interact with a number of possible executors, namely AWS Batch and EMR. 
It’s feature list is expansive and could prove a perfect solution for those interested in running only hadoop based jobs. 

The final solution was AirBnB’s Airflow solution which at the time was just picked up by the [Apache Foundation](https://github.com/apache/incubator-airflow). 
Airflow was known to some of the people here in HBC but when they investigated it, it was still in its infancy and was missing a lot of features. 
We decided to see what progress was made since the last time it was looked at and we were pleased with the improvements. 
It was ticking all the boxes and after one of the engineers here did a proof of concept we decided it was the way forward for us.

For a quick reference between Luigi vs Airflow, this is a great [link](http://bytepawn.com/luigi-airflow-pinball.html)

## The first attempt…

Implementing the Airflow solution was a slight bit tricky for us at the beginning. 
A lot of the team’s expertise was based in Scala, so implementing a python based solution created a great opportunity to learn about the language.

Early into the project one of our interests was to figure out how to deploy Airflow to our AWS account and how do we then deploy the DAGs to the instance. 
We addressed the first by standing up an ECS cluster with Airflow installed on it. 
For the second we setup  the ECS instances with a cron job that would pull down any changes that was pushed to the S3 bucket.

We were able to successfully migrate all our existing jobs into DAGs and with some of the additions we made to the code allowed us to integrate nicely with our AWS tools such as Batch, 
SNS and Lambda

In this attempt, we decided to fork the master branch of Airflow and use that as a source for us to deploy to ECS. 
This gave us some benefits such as customizing some of Airflows base code to provide us with some extra functionality. 
After some soul searching however, we decided that this perhaps was not the best approach. Maintaining the branch and our additional code could create a maintenance issue for us in the future, 
for example an incompatible change with our additional code. We decided that there must be a better way.

## The refinement…

In the first attempt we figured out lot of the early problems with Airflow but we decided that maintaining the forked version was going to cause trouble down the road.
To try fix this, we decided to get a vanilla based Airflow instance up and running. This was partly to help with maintaining the system going forward since we didn’t want to have to constantly merge changes from the master branch into our fork.
This decision coupled with our earlier decision to change some of Airflows base code caused some problems for us.

We decided to go with the latest release of Airflow (1.9) and create a fully dockerised version of Airflow with our DAG’s.
Luckily there are people already working in this space and we were able to source a lot of the work required from this [repository](https://github.com/puckel/docker-airflow).  
To migrate the base code that we changed, we found out that Airflow had already solved this problems via it’s [Plugin system](https://airflow.incubator.apache.org/plugins.html).  
The plugin system gives us a nice way of expanding our functionality and hopefully releasing our plugins as an open sourced in the future.

This process had its challenges but there is a great community of Airflow users and we were able to get a lot of help. Some of the sources we used were Stack Overflow and the ever busy Apache Airflow gitter.

## Next steps

Now that we have our Airflow setup and jobs migrated we are experiencing the full benefits of what airflow has to offer. 
Within a day we were able to create plugins that allow us to integrate with AWS EMR. This allowed the creation of DAG’s that will in the future support the migration of our ELT process to ETL using Spark, a big 2018 and 2019 initiative here at Gilt/HBC. 
We are eagerly awaiting the improved DAG deployment system thats coming to Airflow to improve our deployment process but we feel we are in a good place with it at the moment.

The Data teams roadmap has multiple exciting challenges to solve from ingestion, transformation to loading. 
Having our Airflow setup, we feel we are in a good position now to tackle these problems.

A big callout to [Daniel Mateus Pires](https://github.com/dmateusp) who acted as our go to person in all things Airflow flow.

Over the new month or so we are really going to ramp up and if you’re interested in helping us solve these problems, take a look at our careers page [here](https://www.linkedin.com/jobs/search/?f_C=167354%2C1453743&locationId=OTHERS.worldwide) and get in touch.



---
layout: post
title: 'Meet a Gilt Technologist: George Chien, Lead Business Intelligence Engineer '
date: '2014-08-13T14:49:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Gilt Data
- data
- analytics
- George Chien
- Business Intelligence Engineering
- Aster Teradata
- Cognos
- Spotfire
- Scala
- Looker
- Hadoop
- Apache Kafka
- Kafka
- SQL
- data analytics
- Kinesis
- AWS
- people
- meet a gilt technologist
tumblr_url: http://tech.gilt.com/post/94649384384/meet-a-gilt-technologist-george-chien-lead
---

If you’re a Business Intelligence Engineer, we’d like to hear about your favorite tools and methodologies. Email us at lapple at gilt dot com.
Hello, George! Tell us a bit about how you arrived at Gilt.
I got here in 2012 after working in business intelligence at Everyday Health, MTV/Viacom, and Hewlett-Packard, and before that I went to school at Cornell.
How have things changed since the early days?
When I first joined the team, we were still trying to figure things out. Our data warehouse was new, our self-service framework wasn’t built out yet, and our goals weren’t as well defined. Since then we’ve streamlined our processes and become a lot more efficient, within the team and out. We were doing a lot of repetitive work and now there’s much more time to work on projects that will make a difference and that we’re passionate about.
What drew you to Gilt in the first place?
Just walking into the office I felt a buzz and got the sense that there’s a healthy atmosphere here. Gilt has a great reputation, with a lot of smart people working here. Everyone I spoke to during the interview process, I had a good connection with. Technology-wise, we’re pretty cutting-edge and I was excited to work with the team and learn new skills with the latest tools.
What does an average day look like for you?
Every day is different, but typically I spend half the day doing analyses, then working on projects for different teams. For example, I’m working with our customer transactions team to get credit card data into our data warehouse, and our loyalty team on getting new AB testing data into the warehouse as well. The data team will help the engineers figure out how the data model will work and look. Projects vary in length and scope, but the ones I’m working on now have lasted a couple months.
The data team’s recent work has been involving a lot of open source technologies.
Yes. We’re doing much of our current work through new event streams, in which services relay messages to Kafka, and the data warehouse reads those messages. Eventually we’ll use Hadoop for the file storage, with Kafka relaying the messages there and the data warehouse reading from Hadoop. In our work with Kafka, the idea behind it—and we’re not there yet—but it is to create easy access to all of the data within the company, so no one will have to ask an engineer to create a process to access a file or send data to the data team; they can just publish events to Kafka.
In terms of technology skills, what should a business intelligence engineer possess?
Prior experience using a range of business intelligence tools, a solid background in SQL, and an understanding of how a data warehouse works. But the primary qualification for the job is a good mind for analytics–the ability to draw connections between different data sources, understand data models, see patterns, and consolidate them into insights decipherable by anyone.
At Gilt, a lot of our data isn’t exact, so working with it involves a lot of research. At a more granular level, that means working with various engineering teams to understand the data they’re producing and putting the data together from multiple sources (inventory, site-live inventory, email, click-stream, order transactions) to fit it into a model. Then we run the data through the model to understand its various attributes, and highlight the important attributes to support the various business decisions we make.
One of the things we pride ourselves on here is our flat structure. Do you get to work with tech leadership much?
I do work with the tech execs occasionally, but I work more frequently with the heads of other departments, like Marketing and Merchandise Planning. The data team works with every department in the company outside of tech: marketing, finance, operations, merch planning, etc. The projects we work on relate to everything from supply chain management, to new marketing initiatives, to understanding our customers and demographics, to AB testing and understanding more about the user experience. Across these initiatives, my role is to understand where all the data comes from, put it all together and make it easy to use for everyone else in the company who needs it. Within the data team, I work closely with our chief data scientist to run data models and see if certain assumptions about our data make sense or not.
Talk a bit about the tech stack our data team uses.
Our stack currently includes Aster Teradata, Hadoop, Kafka, AWS and AWS Kinesis, real-time data events streams, and lots of micro-services written in Scala. On the front-end we work with Cognos, Looker and Spotfire.
What do you enjoy most about working with this stack?
Our data warehouse is pretty amazing in terms of speed and processing power. The amount of data we can process, run analytics on and get responses back–and quickly–is pretty awesome. A lot of other places I’ve been to, especially startups, don’t have the infrastructure to do that. It’s great to be able to iterate on your analytics quickly—you don’t have to wait for the data to come back.
The MR functions that Aster provides, and the functions we can create on our own, make our analytics even faster. And having Scala programmers on our team, who can help write MRs so that we can do things Aster can’t do out of the box, is really powerful.
Which technology do you personally use the most?
Most of my work involves working with SQL, but also Cognos and Looker. We do a lot of data mining and looking at large sets of data to find patterns.
We’ve been a bit bullish about Looker since we started using it. What are its advantages?
Looker has empowered people across the business to do their own analysis. It’s generated a collective sense of ownership when it comes to our data and analytics. The more powerful self-service is, the more insightful our analytics can be, and the more the data team is freed up from mundane tasks involving pulling data for people. We’re free to discover new things and take on new projects, not just build reports for the rest of the company.
What are your favorite things about your job?
Interacting with all the different teams–it helps me to understand the business more. Designing new solutions and participating in the discussions on how to best approach an analysis, choose the data to work with. I also appreciate the diversity of projects. Usually the data team will focus on helping one department at a time for 2-3 months, but even then we’re still working with everyone.
What do you like most about the data team’s culture?
Everyone is pretty independent, yet we’re pretty close. We’re all there for each other, but we give each other a lot of leeway to build and develop the way we want to.  
And what about Gilt’s culture in general?
We’re quick in getting things done.  Everyone is really helpful.  We act on new ideas quickly and we’re not afraid to fail.

---
layout: post
title: 'A Chat With Data Scientist Claudia Perlich '
date: '2013-10-07T12:04:00-04:00'
tags:
- Claudia Perlich
- data
- predictive analytics
- big data
- nyc
- technology
- DataDivas
- Econometrics
- Dstillery
tumblr_url: http://tech.gilt.com/post/63379278205/a-chat-with-data-scientist-claudia-perlich
---


Recently Gilt had the privilege of hosting a fireside chat with Claudia Perlich, Chief Scientist at Dstillery (formerly Media6Degrees). Named one of Crain NY’s “40 Under 40,” Perlich has won the Advertising Research Foundation’s (ARF) Grand Innovation Award as well as many data competitions, and is a frequent speaker at industry and academic events. She earned her PhD in Information Systems from NYU, teaches at her alma mater’s business school, and holds several patents in machine learning.
Claudia was kind enough to answer a few of our questions about her work, the world of big data, and her many outside interests.
In your talk at Gilt a few weeks ago (organized by the DataDivas meetup group) you made the point that the art of predictive analytics involves making do with second-best, because there is no “perfect” data set. How do you know when it’s time to accept what is and make do with the data you have? (It’s probably situational, but some best practices might be helpful.) 
That is an advantage of predictive modeling: In the end, it all translates to how well a model performs in the deployment setting, and that I can hopefully measure correctly by recreating the exact use scenario. I have to be extremely diligent when measuring whether the model is good enough for my purpose. Once you are certain about your evaluation, you can decide when to stop looking for better. 
All this comes back to the notion that you must know the exact use for your model, and this is where you are correct and it is very situational. For automated stock trading, you need top performance. For sentiment analysis, being in the right ballpark is often enough. For medical diagnosis, one type of mistake is much worse than the other. And in advertising, raw predictive performance is just one of the many metrics that matter.

You’ve written that “For me, clean data (cleansed by somebody else) is dead. It has lost its soul.” When data loses its soul, what is the effect on the general public? 

This wasn’t meant to be a religious statement–it is a personal attitude. What happens when somebody cleans the data is that it loses the vital details that help me to identify all the potential issues. I can no longer ‘debug’ the data. The result, typically, is that I am missing something that ultimately will limit the performance I can tease out of it. 
Think of it as a detective game: if somebody has cleaned the scene of the crime, you will have a hard time finding out what actually happened and your chances of catching the bad guy decrease considerably. 
So, what is the effect on the general public? The data will be less useful, and we will realize later than necessary that the way we collected the data had issues, the insights gleaned from it are potentially biased, and it will take us longer to discover that than it should. There are no obvious threats–it just limits our ability to utilize the full potential of the data.
Big data is a hot topic these days. What are the pros and cons of this development? What would you like to see emerge from all the big-data talk taking place right now?
There are two major pros of very different nature. On the technology side, the advances of cheap data collection and storage make the advantages of data analytics available to all layers of both the economy and society: from schools and nonprofits to startups and the big players. At the same time, the hype around big data has fueled a tremendous excitement about using data and created an unprecedented demand for data scientists, which in turn has translated to an influx of talent. I have always seen the opportunities, and soon, due to the increased manpower and skill, we might actually get to realize them. There might be a few disappointments on the rocky road, but I am excited about the future.

Of all the technological advancements in the big data field over the past few years, which would you say has been the most significant, and why? 
Clearly, the most amazing advancement is the lower cost of collecting and storing data, while making access extremely fast and easy. Gone are the days of storing data somewhere on tape and needing 30 days to access it. Today we live in a world where we can collect terrabytes daily and still access some tiny slice of it from May 4, 2010 in about one minute. This possibility opens the door to much more elaborate analysis AND, more importantly, allows every analysis to start from the raw data rather than starting with the curated (and soulless) aggregated summaries. 
In Gilt’s work with personalization, we have to be mindful of the line that separates delivering value from being too invasive. What are your thoughts on that dividing line?

That is actually a very interesting discussion. My personal experience has been that I am perfectly fine with invisible, good use of data–I expect you to do it, and, moreover, I expect you to be good at it. Examples are recommendation systems in Amazon or Netflix. I am VERY much aware that I share a lot of data, and I expect it to be used to the mutual benefit of companies and consumers. In fact, I have been repeatedly disappointed by some of the recommendations that I have been given, and often “say” to my device of the moment, “You should know me better than that!” 
On the other hand, I had an epiphany while reading a German newspaper, and all of a sudden a message appeared recommending an article that a friend of mine had read. This must have come from data only Facebook could have had, and on that day I decided to delete my Facebook account.  So having it used behind the scenes (and I am very much aware that this is happening) doesn’t bother me nearly as much as a blatant attempt to manipulate me by pushing the ‘social connection’ buttons openly. That is where I drew the line in the sand. But maybe that is just me.
Generally I think that it really should be within the power of the consumer to have a voice as to how his or her data can be used. The broader issue is a lack of information of what is done with what data, and to whose benefit. The reality is consumers don’t know who is doing what with their data, and they lack a full understanding of the economic implications. For most purposes (recommendations, search and many others) I am very comfortable with sharing data and having it used. I am also aware that, while one can switch off tracking, that will not make advertising go away. I will still see ads, just much more bothersome ones, and some with potentially nefarious side effects. 
On some level, the advertising industry, when it works well, is serving as a wealth redistribution system that ultimately fuels much of the information technology infrastructure. Today everyone expects infrastructure (blog hosting, etc.) AND information to be free. And arguably advertising is footing the bill of all the user-generated and ‘non-paid for’ content to be freely available on blogs, news sites, apps, etc. Unfortunately, the trade-off is often invisible and not up to the choice of the user.
You touched upon this issue in your discussion of Target. More on that, for our readers?
In my opinion, the Target case is primarily a testimony to the power of data and the quality of their analysis. The reality is that every day parents are realizing one way or another that their daughter is pregnant. But in this case, it was traceable to an act of data mining and makes for a great story in the day and age of big data (and Big Brother watching you). But what we aren’t told is how often the mailer went to the wrong family, and how many expecting families were very happy to receive them.  

What’s on your “essential reading” list (books, websites, specific writers/data scientists)?

On the work-related reading list, one book that completely changed my viewpoint of modeling and data more than 15 years ago is William Greene’s Econometrics. It is really technical, but I feel that it truly conveys the important parts of statistical thinking around modeling. The other books that I hold in high regard from the machine-learning side are Elements of Statistical Learning (Hastie et al.) and “Pattern Classification” (Duda et al.). A great book for people with less of a technical background but an interest in using data in various business applications is Data Science for Business by Foster Provost and Tom Fawcett. I am currently using it in my MBA course at NYU.
As for reading for fun?
For fun, I like fiction/science fiction, including things like Too Many Curses by Lee Martinez, the “Bartimeous Trilogy” by Jonathan Stroud, and I very much enjoy books on biology, evolution, etc. (Dawkins, Waal, Hitchens).

This article notes that every year you learn something new. How do you choose what that new thing is? And how do those new things help you develop new insights into your work?

I have never given much thought to the selection process. I guess something just catches my attention, or there is an opportunity and I jump at it. It isn’t a strategic thing that I do with a specific purpose, but it’s driven more by the people I interact with. I would say that it reflects a deeply rooted curiosity and also the habit of challenging myself. 
I just really love to be able to do things. For instance, through some random accident, I came across a carbon fiber cello a few years earlier and could not resist buying it. I love music, I play piano and I really like the warm and round tone of the cello. So last year, when my son started playing double bass at school and was starting to learn the basics, it was the perfect opportunity for me to jump in and learn as well. 
What did you learn this year?
This summer I took on springboard diving because someone at the local pool was giving lessons to the kids. It is one of these things I always admired–the beauty of it, the control and skill of making something really difficult look absolutely amazing and easy. So really–there is no direct relationship to work other than the ‘I can do this’ attitude. 

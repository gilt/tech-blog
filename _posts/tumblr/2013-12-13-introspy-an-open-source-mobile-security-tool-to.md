---
layout: post
title: 'Introspy: An Open-Source Mobile Security Tool to Help You Save Time and Avoid
  Anguish'
date: '2013-12-13T16:04:00-05:00'
tags:
- Introspy
- infosec
- information security
- open source
- iSEC Partners
- Sam Kassoumeh
- security
- mobile security
- tools
- Mobile First
- mobile development
- Cryptome
- Tom Daniels
- Alban Diquet
tumblr_url: http://tech.gilt.com/post/69907870380/introspy-an-open-source-mobile-security-tool-to
---
This past June, mobile revenue surpassed 40% of Gilt’s total revenue for the first time since our founding in 2007. In 2014, we expect mobile revenues to grow even more, which has influenced us to adopt a “Mobile First” approach to development. On the user experience side, Mobile First means creating intuitive and innovative ways to use the mobile framework–for example, iOS push notifications–to help solve traditional notification problems and ultimately make life easier for customers. For me and other engineers on Gilt’s security team, Mobile First means continuing to ensure our mobile platform is functionally secure by looking deeper into run-time behavior, traffic analysis, local storage, and caching of our mobile apps.  
Though mobile development is a booming market, until recently the range of security tools available to perform deep security assessments has remained limited. To date, the assessment process has been very arduous and mostly manual. Security teams have needed to employ a sometimes hodge-podge variety of traditional tools and assessment methodologies–for example, proxying mobile traffic through an interceptor tool to capture and inspect network traffic contents–and combine them with detailed manual code reviews. This method works but is time-consuming, because it requires installation and configuration of a plethora of fragmented assessment tools on a iOS device.
However, our security team has recently benefited greatly from some new open source tools aimed to simplify things–namely Introspy, a security profiler for iOS. With Introspy, we’ve been able to save time and augment automation to the current application analysis process. 
We learned about Introspy via Twitter. Several of our security-conscious acquaintances began tweeting about it, but one tweet in particular from Cryptome caught our attention:

Developed by Tom Daniels and Alban Diquet, and fully backed by iSEC Partners, Introspy was born out of necessity. “The amount of mobile (specifically iOS) work I was doing about a year and a half ago was ever increasing,” Tom recently told me via email, “and anytime we were doing blackbox assessments or unusually complex projects I never felt like I had the appropriate tools to do the job.” Performing even minor tasks required substantial time and effort. After building some one-off MobileSubstrate tweaks, Daniels pitched the idea of Introspy to Diquet, who expressed the same frustration with the lack of tools. “Thanks to iSEC, we were able to get the time and resources we needed and just built it,” Tom says.
How Introspy works
As a prerequisite to installation, you need a jailbroken iOS device. In a nutshell, jailbreaking your iOS device removes all limitations implemented by the manufacturer, allowing root-level access of your device and installation of many unauthorized applications, themes, and plugins (you may notice a UI hack or two in our iOS screenshots below). As this goes to press/blog, a device with iOS 6.1.2 or lower is required. Our team used an iPad and iPhone, both running iOS 6.1.2. 
Introspy is comprised of two separate components: an iOS tracer and an analyzer.  Both components can be downloaded from the iSEC GitHub repo and installed to the jailbroken iOS device directly from the command line.  Once the tracer is installed, the user can select which iOS apps to monitor thought the iOS GUI. The tracer will hook into the security-sensitive iOS API calls of the apps you choose, checking for sensitive calls relating to security (data storage, cryptography, user privacy, etc).  

As you begin using the app, the details of each call are all recorded and persisted in a SQLite database on the device. For the Gilt app, we performed every possible action on both iPhone and iPad apps, paying special attention to the output of critical actions such as logging in, adding a credit card, and making a purchase.  
The database results are fed into the analyzer portion of the app, which generates an interactive HTML report displaying all recorded API calls and any potential vulnerabilities or security misconfigurations. If necessary, the reports can be saved locally and distributed to relevant stakeholders. If you prefer command-line interaction (we do), you can use the command line tool to view the tracer’s results directly, circumventing the UI.
Pro-Tip!: Comparative Security
We also performed some comparative security analysis between the Gilt apps and other popular iOS apps like Amazon and GMail to gain perspective approach to mobile security configurations. We confirmed that the Gilt app has a security best-practice configuration quite similar to the other apps we investigated, which gave us some additional affirmation that we’re doing things right! 
The Future of Introspy

Daniels says he and Diquet plan to plan to keep Introspy updated “at least … in terms of which APIs it’s capable of hooking.” So keep an eye out for some iOS7 relevant additions, such as the abstractions to the URL loading system (NSURLSessions) and the new JavaScript to Objective-C bridge (JavaScriptCore).
Conclusion
If you’re looking for a good place to start with mobile penetration testing, Introspy is great app (and 100% free and open source!).  Assuming you’re working with a jailbroken device (if not, jailbreaking can be a fun and rewarding exercise to explore), many key security elements can be investigated by doing not much more effort than simply using your app and exploring the results.

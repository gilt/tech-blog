---
layout: post
title: Gilt releases Mockingbird Data Environment open-source project for iOS
date: '2015-02-04T11:06:00-05:00'
tags:
- gilt
- gilttech
- Apple
- iOS
- iPhone
- iPad
- tech
- engineering
- software engineering
- open source
- giltmobile
- Gilt Mobile
- Evan Maloney
- Mockingbird
- Mockingbird Data Environment
tumblr_url: http://tech.gilt.com/post/110074817289/gilt-releases-mockingbird-data-environment
---
For more than 5 years, Gilt’s Mobile team has been developing and using a platform that lets its iOS applications adapt to server-side changes long after they’ve been released.

This platform has been the backbone of an application that has served millions of users, handled hundreds of millions in sales, and has been consistently highly-rated in the App Store and repeatedly featured in Apple keynotes.

Today, we’re excited to reveal the official open-source release of this platform: announcing the Mockingbird Data Environment 1.0!

From the project’s description on GitHub:


It is a common scenario for iOS app publishers to have a population of users running old application versions. Often, users are stuck on old versions because the current version requires a release of iOS more recent than their hardware will support. Such users won’t be running your latest app version until they buy a new device, assuming they ever do.

For some types of apps, this isn’t a big problem. But for apps that must communicate with network-based services, having a wide variety of old versions out in the wild makes it difficult to evolve and maintain your services.

Eventually, you will be faced with accepting one of these tradeoffs:

Do you drop support for old versions, knowing that there’s a risk of severing valuable relationships with some of your users?

Do you take on the expense and difficulty of maintaining and operating a growing number of legacy backend services over time?

Or do you resign yourself to never evolving your backend systems—or doing it much more slowly than you’d like?
The purpose of the Mockingbird Data Environment is to free you from having to make these compromises.



To experiment with the Mockingbird Data Environment in your own iOS project, use CocoaPods and add the following line to your Podfile:


pod ''MBDataEnvironment''


Then, run pod install from within the directory containing your project’s Podfile.

The Mockingbird Data Environment is available for use under the MIT license. 

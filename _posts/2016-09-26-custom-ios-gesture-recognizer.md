---
layout: post
title: "iOS Custom Gesture Recognizer"
author: Paul Lee
date: '2016-9-26'
categories: 
- ios
tags:
- ios
- gesture recognizer
- paul lee
redirect_to:
- http://tech.hbc.com/2016-09-26-custom-ios-gesture-recognizer.html
---

## Developing New Product Photo Gallery
As part of our Mobile team's ongoing effort to introduce more Swift-based pages in the iOS app, I recently started working on a full screen gallery feature on our Product Detail Page (PDP). The feature is similar to the typical full screen photo gallery users will recognize from many other apps, including Apple's Photo app and e-commerce applications featuring full screen view of product images.

<p align="center">
<img src="http://i.imgur.com/22y1I2Y.jpg">
</p>

## Quick Way to Exit Full Screen View
In order to offer the best shopping experience, we wanted to make sure our customers can easily enter and exit the full screen image view from PDP. Entering full screen view is easy - customers simply tap anywhere in the photo area. For exiting full screen view, we wanted to let customers scroll vertically with a single finger to zoom-out and, if enough zoom-out level is reached, exit full screen. Performing double finger pinch-in gesture to zoom-out beyond threshold level will also close the full screen view but single-finger gesture is much easier and more natural while holding the phone in one hand. It also helps customers browse through products faster. This is crucial when every second counts for grabbing last minute inventory on Gilt's flash sales!

<p align="center">
<img src="http://i.imgur.com/C12f7Bs.jpg">
</p>

## Adding a New Gesture Recognizer

When customers are on full screen image view, they can scroll left or right to browse the next or previous image. That screen movement is handled through `UIPanGestureRecognizer` - one of the built-in gesture recognizers in iOS. Gesture recognizers provide (x,y) coordinates of users' finger movement as a gesture is performed. New (x,y) coordinates are captured and passed to application every 16.7ms, or 60Hz. 

To allow browsing to the left or right, PanGesture listens for x-coordinate change in a user's finger movement and moves screen to the left or right accordingly. It ignores y-coordinate change. For example, if a finger moves diagonally to the left, it creates the same effect as moving horizontally to the left as change in y-coordinates are ignored.

In order to support scroll-down-to-zoom-out-and-exit function, we added a new gesture recognizer that ignores x-coordinate changes and only recognizes y-coordinate change. That is, if a finger moves diagonally to the left, it will zoom out the image and, once enough zoom-out is applied, exit the screen. The application will zoom out images gradually as the y-coordinate changes, ignoring all x-coordinate changes.

<p align="center">
<img src="http://i.imgur.com/r0kyaq2.jpg">
</p>

## Conflict
We now have two gesture recognizers on the same screen that perform opposite work of each other. One listens to delta X and ignores delta Y. The other one listens to delta Y and ignores delta X. Given how dense iOS device screens are and how fast finger movement is captured, it is very unlikely that a user's finger movement is perfectly horizontal or vertical. Thus, we assume that we will always see diagonal movement, which changes both x and y coordinates at the same time. If a finger moves diagonally, we cannot let both gesture recognizers be activated because we must perform only one of the two actions - scroll to next/previous image or scroll-to-zoom-out.

<p align="center">
<img src="http://i.imgur.com/ewJasL2.jpg">
</p>

We know we have to pick one of the two recognizers very early on when gesture begins. That way, we know what to do with subsequent x, y coordinate changes. Interestingly, customers expect that too. They understand that if they start horizontally scrolling a page, the vertical change in their finger movement won't have any effect while horizontal scroll is being performed. The same goes for scroll-down gesture. They expect that once their intention to scroll down is recognized, any change in horizontal movement during the rest of scroll would have no effect.

The question then is how do we read user's intention very early in their finger movement and pick the right gesture recognizer to activate?

## Solution

<p align="center">
<img src="http://i.imgur.com/FrbvmmN.jpg">
</p>

The answer can be found in the first two set of coordinates obtained. We obtain the very first two set of coordinates and if delta Y >  delta X, then customers' intention is to scroll down. If delta X > delta Y, the intention is to scroll to the left or right. These two set of coordinates are obtained within a fraction of a second as mentioned above and thus the distance covered on the screen will be extremely short. Yet, this is indeed how users tell us what their intention is.

To include such decision process as part of gesture recognizer, I created a new custom gesture recognizer named `VerticalPanGestureRecognizer`. This recognizer will perform the above work at the very beginning of a finger movement and register itself as a success or failure depending on whether or not delta Y was greater than delta X. The regular horizontal movement is captured by `UIPanGestureRecognizer` and this recognizer is conditioned to activate only if `VerticalPanGestureRecognizer` fails.

I am sure all of us have come across mobile applications that support multiple gestures on the same screen. It is easy to take for granted that these applications detect exactly what our intention is. With all of the above in mind, now we can have a little more appreciation for all such convenience!

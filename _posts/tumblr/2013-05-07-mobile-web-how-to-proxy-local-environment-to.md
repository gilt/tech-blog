---
layout: post
title: 'Mobile Web How To: Proxy Local Environment To Devices'
date: '2013-05-07T17:54:00-04:00'
tags:
- gilttech
- mobile
- ios
- android
- Charles proxy
- gilt
- mobile development
- localhost
- computer_ip_address_here
- MODIFY NETWORK CONFIG
- Gregory Mazurek
tumblr_url: http://tech.gilt.com/post/49882407629/mobile-web-how-to-proxy-local-environment-to
---
When you develop a front end experience for the full screen, the feedback loop between code and test is relatively fast. You code. You refresh your browser. Repeat. When you develop a front end experience for mobile devices, this can become a little cumbersome because the feedback loop can sometimes feel much slower. There are emulators for your machine and browser sizing/user-agent strategies that you can employ to make your development process more efficient. But in the end, you’re going to want to test on your devices.
In this post, I’ll explain how you can proxy your local development (localhost) to both your Android and iOS devices. When you do this, you’ll be able to code, refresh, repeat a lot faster and more efficiently.
Charles Proxy
To get started, you need a strategy to manage your HTTP proxy. I use and recommend using Charles Proxy (http://www.charlesproxy.com/) but there are certainly other alternatives. Charles Proxy is very powerful but I won’t be going into much detail about it here. Instead, we want to set up a port that we can HTTP proxy to.
If you click on PROXY, then PROXY SETTINGS, you’ll see a menu where you can enter in a port that you would like to proxy to. I’ve chosen 8888.


Charles Proxy is going to look for incoming connections on this port. When you connect iOS or Android to this port, you will see that Charles Proxy will ask you to allow or deny this connection attempt:


Now, let’s connect our devices.
iOS
In iOS, navigate to your WiFi menu and then tap into your connected WiFi. At the bottom of this screen, tap on MANUAL under HTTP Proxy. Where you see computer_ip_address_here, enter your computer’s ip address and where you see 8888, enter the port that you set up on Charles Proxy.


That’s about it. On your device, open localhost:1234 or whatever in a browser and then Charles Proxy will ask you to allow or deny. You can now start coding on your machine and refreshing on your iOS device. You’re done.
Android
On Android, tap SETTINGS and then Wi-Fi. Next, tap and hold on the WiFi network that you are currently connected to. On the following menu, tap on MODIFY NETWORK CONFIG.

You next see a menu to manage your network config. Scroll to the bottom of this modal and tap on SHOW ADVANCED OPTIONS.

In the menu options that appear, you will see configuration settings similar to those found in iOS. Where you see computer_ip_address_here, enter your computer’s ip address. Where you see 8888, select the port you set up with Charles Proxy.


And, that’s about it. On your device, open localhost:1234 or whatever in a browser and then Charles Proxy will ask you to allow or deny. You can now start coding on your machine and refreshing on your iOS device. You’re done.

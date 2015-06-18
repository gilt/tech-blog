---
layout: post
title: 'Mobile Web How-To: Inspect Elements On Android''s Internet Browser'
date: '2013-05-03T15:51:00-04:00'
tags:
- gilt
- mobile
- android
- frontend
- how-to
- Gregory Mazurek
- gilttech
- gilt mobile
- WebView
- JavaScript
- Adobe Inspect
tumblr_url: http://tech.gilt.com/post/49530971053/mobile-web-how-to-inspect-elements-on-androids
---
I’m building Gilt’s new Android app and a good portion of the website is an Android WebView. As you may or may not know, this WebView uses the default Android Internet Browser to render webpages. You probably know this app best by its logo in the lower right hand corner of this screenshot:

When you use Google Chrome on the Android device, inspection is very straightforward – I’ll cover this in a later post. But for Android Internet Browser, there is not to my knowledge a good way to inspect and manipulate the DOM.
I needed to inspect the DOM because I inherited a JavaScript file that allows us to mimic scrolling events on mobile devices via webpages. The scrolling library works as expected in all other browsers on all other devices. So, I needed to better understand what was happening in the Android Internet Browser.
The tool that bridged my device to an inspector tool is Adobe Inspect. To get going, you have to install 3 components:
1. Adobe Inspect on your computer: http://html.adobe.com/edge/inspect/
2. Google Chrome Extension Adobe Inspect: https://chrome.google.com/webstore/detail/adobe-edge-inspect/ijoeapleklopieoejahbpdnhkjjgddem?hl=en
3. Google Play Store Adobe Inspect: https://play.google.com/store/apps/details?id=com.adobe.shadow.android&hl=en
Once you have installed everything, connect your Android device to your computer and make sure you’re on the same WiFi. On your Android Device, open Adobe Inspect and click the plus sign in the upper-right hand corner to get to this screen:

Get your ip address from your computer and enter it in Adobe Inspect on your Android Device. If you skip ahead, you can find your ip address on your computer by opening Google Chrome and clicking on the Adobe Inspect icon in the nav bar – you’ll see it there as well. After you input your ip address into the Android device, you’ll receive this screen:


Now, open Google Chrome and open the URL of your choice with the Adobe Inspect extension enabled. In the upper right hand corner, you’ll see the Adobe Inspect icon with a green plus sign.


Click on this icon to reveal a menu that displays your computer, your IP address, and your device name.

Enter the Passcode you received from your Android device.

Now that you’re connected, click on this button next to your device name:

Then, a new window should open that looks like this:

You can see that this is a standard Google Chrome inspector with the name of your device and the url that is currently being inspected. Click on this link and then click on Elements.

Here, you have a standard inspection workflow similar to what you would use for the full screen experience. You can use the console and other features in a more limited manner to what you would use on the full screen experience. And, Adobe Inspect will highlight what DOM elements are being inspected on the device:


There is much more you can do but, hopefully, you’re now set up to debug the Android Internet Browser (not that you needed to debug anything in the first place).

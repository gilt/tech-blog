---
layout: post
title: Five Things You Need to Know About Hammer.js 2.0
date: '2014-09-23T14:06:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Hammer.js
- Hammer.js 2.0
- Kyle Dorman
- Special Operations
- open source
- JavaScript
- JavaScript libraries
- Hammer.js 1.x
- touch events
- DOM
- API
- pup-sub
- Recognizers
tumblr_url: http://tech.gilt.com/post/98240068394/five-things-you-need-to-know-about-hammer-js-2-0
---

Hammer.js is a JavaScript library that makes touch events easier to identify, handle and manipulate. Recently, Hammer.js was upgraded from 1.1.3 to 2.0 and the API was drastically changed. If you’re using Hammer.js 1.x at work or for fun, interested in Hammer.js, or intrigued by touch events in general (but haven’t actually used them), this article is meant for you!
The Gilt team uses Hammer.js in many of our carousels for tablets, but otherwise sticks to native touchstart and touchend events. In creating a personal project that made extensive use of Hammer.js 1.x, I found it to be an extremely helpful library for identifying complex touch events like pinch and swipe. I also found that it lacked a full set of API features, so I wrote some simple helpers and a wrapper to make Hammer easier to use for myself. The look and feel of Hammer 2.0’s API is completely different from that of 1.x, and includes many of the features that I believed Hammer.js lacked. 
These are the top five things I think everyone should know about Hammer 2.0 and how it’s different from Hammer 1.x:
1. Multiple Hammer Instances
In Hammer 1.x, the Hammer creators advised you to create a single Hammer instance on the page. This instance would most likely be bound to the body, so all touch events would be listened for. As events happened on the page, the Hammer instance would act as a publisher and notify subscribers about touch events. The Hammer instance could be subscribed to different touch events.

    var armAndHammer = new Hammer(bodyElement, options);
    
    armAndHammer.on(‘hold’, handleHoldEvent(ev));
    

In Hammer 2.0, you can (and are advised to) create multiple Hammer instances on the page and bind them to the specific DOM elements where they are needed. The new API feels much more like jQuery event-binding and much less like pup-sub. 

    var armAndHammer = new Hammer.Manager(el, options);
    
    // or
    
    var armAndHammer = new Hammer(el, options);
    

Initially, I was apprehensive about the new API approach. The pup-sub model was lightweight and easy to conceptualize, but the approach came at a cost. In Hammer.js 1.x, the Hammer instance notified the subscriber about every touch event on the page, and the subscriber was responsible for filtering touch events to ensure that the element that had been touched/tapped/etc. was indeed the element they wanted to act on.

    armAndHammer.on(‘hold’, function (ev) {
    
        if (ev.target === holdEl ) {
        
            handleHoldEvent(ev);
        }
    });
    
Using Hammer 2.0, each Hammer instance is bound where the event happens and ensures the correct touch event happens on the correct element.
2. The Manager
In Hammer 2.0, each Hammer instance is called a Manager. A Manager can be instantiated by calling either

    var armAndHammer = new Hammer.Manager(el, options);
    

or

    var armAndHammer = new Hammer(el, options);
    

The single Hammer instance in Hammer 1.x can also be considered a Manager. In 1.x, the single Hammer Manager automatically listened to every Hammer touch event and broadcast every event it received, whether or not the developer wanted it to–or whether it was even necessary. For example, even if there were no subscribers to the pinch event, Hammer would calculate and publish any and all pinch events. If you were not specifically listening to this event, you would see no true effects on the page as no functions would be called via pub-sub. That being said, calculating touch events is not a simple JavaScript operation and it was unnecessary for the single Hammer Manager to listen for unused touch events.
In 2.0, each Hammer instance is called a Manager. In 2.0 Managers bind to specific elements and are only responsible for the events associated with those elements. To phrase it another way: Rather than assume you are interested in all touch events for a specific element the Hammer instance is bound to, Hammer 2.0 enables developers to create empty Managers that listen to zero events and then specify which touch events this Manager should listen for.

    // empty Hammer instance
    var armAndHammer = new Hammer.Manager(el, options); 
    

Hammer 2.0 also allows users to create a Manager with a default set of events by skipping the Hammer.Manager constrictor and instead using the Hammer constructor:

    var armAndHammer = new Hammer(el, options);
    

Although adding touch events to the Manager is more complex (because the developer is responsible for adding the touch events they are interested in), it gives the developer more specificity for their touch events. Additionally, this setup becomes much more testable because you know what the setup of the Manager will be on page load. 
3. Recognizer
As I mentioned above, in Hammer 1.x the Manager knows about, listens for, and publishes all touch events. In 2.0, Managers start out empty, and the developer adds events to the Manager using objects called Recognizers. Recognizers are essentially objects that are responsible for groups of touch events in the same mutual category. For example, the swipe Recognizer listens for swipe, swipeleft, swiperight, swipeup, and swipedown events.
For each touch event you are interested in, you create a new instance of a Recognizer and add it to the Manager. Once the Recognizer is added, the Manager can listen for events from that Recognizer.

    armAndHammer.add(new Hammer.Pan({event: ''pan''});
    
    // the Recognizer has been added to the Manager 
    // and we can listen for pan events
    
    armAndHammer.on(''pan'', handlePanEvent(ev));
        

In 1.x, the single Hammer instance essentially came with all Recognizers included. The benefits of adding Recognizers yourself are two-fold:

First, each Hammer instance is lighter and responsible for a subset of touch events. 


Second, touch events can easily be customized. In Hammer 1.x, the options for events such as “hold event threshold” (time a user has to hold down before a hold event is fired) was set on the single Hammer instance, meaning every hold event had to be the same. In 2.0 developers can set the event options in the Recognizer, thus making touch events as customized as you wish them to be.


    var myPanRecognizer = new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICLE, threshold: 0 });

    armAndHammer.add( myPanRecognizer );
    

4. Upgrade Path
The simplest upgrade path from 1.x to 2.0 can take as little as one hour. More complex upgrade paths utilizing some of Hammer’s new API features can take longer. When I upgraded from 1.1 to 2.0, it took me about four hours to upgrade a project that used six different touch events.
Here is a Gist that shows a simple and more complex upgrade path. In the simplest upgrade path, very little code has to change, and you can still rely on a single Hammer Manager bound to the body. If you use the Hammer constructor instead of the Hammer.Manager constructor, the Hammer Manager will have recognizers already added. You can still filter the touch events yourself for the appropriate element. The only difference is that you may have to change the options hash that you pass in.
In the more complex upgrade path, bind a Hammer Manager directly to the element you want to listen for touch events on, then add Recognizers for the appropriate touch event.  Remove any DOM filtering code you had previously used. If you are only using Hammer in one place, upgrading to the simplest path is not a bad option and you may not even feel the need not upgrade at all. But if you are using Hammer for multiple DOM elements, upgrading to use multiple empty Hammer Managers and adding recognizers yourself is a better option and will hopefully simplify your code. 
5. My favorite Hammer 2.0 feature and more
One of the biggest issues I had with Hammer 1.x was its inability to programmatically turn events on and off. On touch devices, it’s quite common to have many touch events associated with a single element/icon, but all the events may not be ‘active’ at the same time. Depending on the state of the phone for example, an app icon can be tapped, pressed, or dragged. In Hammer 1.x, I developed ways of checking the application state and preventing events from firing, but it was all very hacky.
In Hammer 2.0, Recognizers have their own states, controlled through an enable option that is passed when initializing a Recognizer. The default is true–i.e., the Recognizer is on–but you can also pass false or a function. Using a function is the best option to handle states for your touch events–it allowed me, for example, to easily and directly control the state of my web-app for each touch event. I highly recommend checking out this feature if/when you check out Hammer 2.0. (http://hammerjs.github.io/toggle-recognizer/)
Overall, I am very happy with the Hammer 2.0 upgrade. Its API is much easier to use and it has some really useful touch event handling features baked in.
Creative Commons photo by HomeSpot HQ

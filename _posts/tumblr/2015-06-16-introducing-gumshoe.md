---
layout: post
title: Introducing Gumshoe
date: '2015-06-16T10:17:48-04:00'
tags:
- gumshoe
- google analytics
- gilt
- events
- event tracking
- andrew powell
tumblr_url: http://tech.gilt.com/post/121673461239/introducing-gumshoe
---
An analytics and event tracking sleuth.

In late 2014 Gilt received word that a core feature of Google Analytics (henceforth known as GA) would be removed in the next iteration of the platform. The ability to redirect collected data and events to a secondary endpoint had grown critical to our the analization of user behavior, patterns, and effectiveness of our user experience, as well as sales forecasting and predictive modeling. Our two most viable options for retaining this ability were to implement another tracking platform from a different vendor or create and implement our own, tailored to our specific needs.

https://github.com/gilt/Gumshoe

After taking a hard look at the heavy hitters of the analytics platform sphere it was decided that we’d take the divergent route and roll our own analytics and event tracking library. We won’t go into detail on why we passed on big players like Snowplow, Omniture, CoreMetrics, et al. Rather, we’ll focus on Gumshoe and its merits.

What Did We Need?

To anyone in development, marketing, or data sciences on the web, our list of needs will sound quite familiar.

First and foremost we required parity with GA’s base page data. The industry has come to be reliant and has standardized on the kind of data that GA collects for various reporting, including vital year-over-year reporting. So no shockers there.

As performance-minded developers we also had a low page footprint in mind.

We desperately needed organized event names and data. One major shortcoming of GA was the lack of enforcement of any kind of standard in event naming and data. Arbitrary event names and varying event data formats produced migraines the size of Mount Fuji for our Data Scientists. It wasn’t uncommon to have the same target event with several different names, in different applications, with different data in different delimited formats.

Related to the variance in event data, we were looking for a high degree of data integrity and confidence.

And last but not least, a low delivery failure or miss rate for the data collection.

Rolling Our Own

Events are events are events. In Gumshoe, everything is an event. There’s no disambiguation between page views, virtual page views, or custom user events. Everything is an event, and it’s a core tenant of Gumshoe.

Right off the bat, parity with GA was key. We started by breaking down the data that GA collected from each page view, and moved forward from there. A basic Gumshoe event consists of the following:

pageData
eventName
eventData


pageData consists of the GA parity data.eventName is self-explanatory; the name of the event we’re passing.eventData is custom data passed by the consumer which should be associated with an event.

Wunderbar! We had the recipe for sending a page view event. But how do we set this up so that others can easily send these events to where ever they’d like? Enter the transport.

Transports are the mechanism(s) by which consumers instruct Gumshoe on how it should send the data for each event. One can configure Gumshoe to send to multiple transports, or a single transport, it’s your choice. A brief example from the repository:

(function (root) {

  var gumshoe = root.gumshoe;

  gumshoe.transport({

    name: ''example-transport'',

    send: function (data) {
      console.log(''Gumshoe: Test Transport: Sending...'');
      console.log(data);
    },

    map: function (data) {
      return {
        customData: {
          someData: true
        },
        ipAddress: ''192.168.1.1''
      };
    }

  });

})(this);


The send method is responsible for actually sending the data. Gumshoe bundles the https://github.com/gilt/reqwest library, which any transports can freely use. At Gilt we use reqwest.js to send the data to our backend event stack, which we’ll cover in subsequent blog posts.

The map method allows consumers to extend the data which Gumshoe is sending through the transport. At Gilt we use this method to attach a giltData object that is sent along side pageData and contains vital Gilt-specific data for every single event that we send.

Using Gumshoe

Once you’ve got Gumshoe included on your page and you’ve specified a transport, you’ll need to initialize the library. It’s as simple as specifying the transport:

// tell gumshoe to use our transport  
window.gumshoe({ transport: ''example-transport'' });  


And sending an event:

window.gumshoe.send(''page.view'', {});  


What’s Next

In forthcoming posts we’ll be talking more about the other goals we listed, specifically how we internally solved event organization, event naming standardization, data integrity, and the remainder of the stack that takes over once Gumshoe has delivered the payload.

We’ve been using Gumshoe on gilt.com for some time now, and have been running constant parity comparisons against GA and we’re very happy with the results thus far. However, we’d be bonkers to claim that Gumshoe is perfect. We’ve tailored Gumshoe to be extensible but so far it’s only been targeted for use at Gilt. We’d love feedback from the community at large. And if you feel you might be able to use Gumshoe, but find it lacking, we’d love to talk about how it can be improved.

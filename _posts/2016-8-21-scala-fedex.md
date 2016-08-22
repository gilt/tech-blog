---
layout: post
title: "New open source project: scala-fedex"
author: Ryan Caloras
date: '2016-8-21'
categories: 'open source'
tags:
- scala
- fedex
- open source
- web-services
- Ryan Caloras
- John Coghlan
---
<p align="center">
  <img src="http://code.scottshipp.com/wp-content/uploads/2016/05/scala-logo-small.png"/>
  <img height="180px" src="http://3.bp.blogspot.com/-SZGsKxvHaHY/VKUwUMGZIyI/AAAAAAAABCA/GRQowwqVxdA/s1600/fedex-main.png"/>
</p>

We recently made the decision to switch from Newgistics to FedEx SmartPost for customer returns at Gilt. A couple of factors contributed to the decision, but the prettiness of FedEx's API was not one of them - it's not exactly the most developer friendly API you can find.

[FedEx Web Services](http://www.fedex.com/us/developer/web-services/index.html) are a collection of APIs to do everything from generating shipping labels to tracking packages. Unfortunately, they're still using SOAP and WSDLs! That means poor support for a modern language like Scala. Their [sample Java client](https://gist.github.com/anonymous/f63e15ed1c7d65385e5a206d3d994ce0) contained a bunch of unfriendly Scala code (e.g. Xml, blocking requests, and Java Classes rather than native Scala).

## Enter scala-fedex
Using [scalaxb](https://github.com/eed3si9n/scalaxb) we were able to generate a native non-blocking Scala client from FedEx's WSDL. We then added a wrapper to further reduce the boilerplate of the raw generated client. The final result being a thin async Scala client for FedEx’s Ship Service API. It also provides a much cleaner [example of usage](https://github.com/gilt/scala-fedex/blob/master/src/test/scala/com/gilt/fedex/FedexClientSpec.scala) than the previously mentioned Java code. We can now use this to generate FedEx return labels on Gilt using native reactive Scala code!

To support the community, we decided to open source and publish scala-fedex. You can find more specifics on the [scala-fedex repo](https://github.com/gilt/scala-fedex).

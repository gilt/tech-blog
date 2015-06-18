---
layout: post
title: Some Sugar for Your sbt Dependency Graph
date: '2014-06-09T13:28:00-04:00'
tags:
- Gilt
- Gilt Tech
- gilttech
- Gilt Groupe
- sbt
- Scala
- dependency graphs
- sbt-dependency-graph-sugar
- Akka
- Play Framework
- microservices
- micro-services
- libraries
- open source
- OS
- transitive dependencies
- Eric Bowman
- Dublin
- Johannes Rudolph
- sbt-dependency-graph
- plugin
tumblr_url: http://tech.gilt.com/post/88288577524/some-sugar-for-your-sbt-dependency-graph
---
Since 2012 the Gilt engineering team has been using sbt to build and deploy microservices and webapps–from our newest Scala microservices to our most ancient Java applications. Microservices tend to have common functionality across the fleet, from Play Framework and Akka, to our own internal libraries. 
Dependencies (and their complex transitive dependencies) have always been challenging to understand and manage. Not surprisingly, the open source community has produced some tools to make it easier. One open source tool we’ve relied on for managing dependencies is Johannes Rudolph’s awesome sbt-dependency-graph plugin. 
Like Maven’s dependency plugin before it, sbt-dependency-graph produces an ASCII-art representation of an application’s dependency graph, making it easier to understand and spot problems. Unlike Maven, though, sbt-dependency-graph can generate different machine-readable graph formats, which enables composing interesting behavior on top of it. 
Most of the time, developers just want to see the dependency graph, and sbt-dependency-graph’s default visual output comes up short. By leveraging the machine-readable formats, we can generate even more powerful visualizations. To that end, the Gilt team has created sbt-dependency-graph-sugar: an open-source plugin that provides some sbt-dependency-graph “sugar” to simplify understanding and managing dependencies. 
If you’re working on a Mac with graphviz installed, sbt-dependency-graph-sugar “just works” to convert the dependency graph to an SVG file and automatically open it on Safari:


To use sbt-dependency-graph-sugar with sbt 0.13.x, you can add it as a plugin to a particular project by putting this line in a .sbt file in the project subdirectory:

addSbtPlugin("com.gilt" % "sbt-dependency-graph-sugar" % "0.7.4")

Or you can make it magically available to all your sbt projects by putting that line in a .sbt file in ~/.sbt/0.13/plugins/.
Once it’s installed, you can view the dependency graph for an application and its subprojects by running:

dependencySvgView

This will compute the dependency graph, convert it to svg, and open it with Safari.
You can also customize the plugin to open files with Chrome and other applications.
We’re hoping to contribute this feature to sbt-dependency-graph after we gain some traction, so give it try, give us feedback and stay tuned for updates. For now, enjoy!

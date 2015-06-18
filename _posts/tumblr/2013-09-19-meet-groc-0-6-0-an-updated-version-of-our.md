---
layout: post
title: 'Meet Groc 0.6.0: an Updated Version of Our Favorite Frontend Documentation
  Generator'
date: '2013-09-19T14:33:00-04:00'
tags:
- Groc
- frontend
- automated documentation
- tools
- Jeremy Ashkenas
- Docco
- Grunt
- Donald Knuth
- open source
- Ian MacLeod
- literate programming
- Kevan Davis
- Eric Shepherd
tumblr_url: http://tech.gilt.com/post/61686385959/meet-groc-0-6-0-an-updated-version-of-our
---
After reading Gilt Senior Software Engineer Kevan Davis’ post on Groc, a fork of Jeremy Ashkenas’ Docco documentation generator, some of you emailed to ask us how to enable block comments. We reached out to Groc creator Ian MacLeod to see if we could all work together on publishing a new version. Ian accepted our proposal, and added Kevan and Lead Software Engineer Eric Shepherd to the Groc project. Click here to check out the latest version, Groc 0.6.0. (Thanks, Ian!)
In updating Groc, we collaborated with several other people (most notably Stephan Jorek) and did about two dozen pull requests–bringing in block comments, doc tags (both mentioned in our previous post), code folding (a new feature), and, of course, a slew of bug fixes and tweaks and polish. Going forward, we will publish regularly–using Semantic Versioning as a guide for our version numbers.
To get some perspective on Groc and its origins, I asked Ian why he created it. “Initially, I was just looking for some additional functionality for Docco–specifically, better support for projects organized into multiple directories,” he explained. “However, those changes added quite a bit of complexity to Docco, and Jeremy preferred to keep Docco simple. So I went my own way (a fresh start allowed me to be more free structuring my own tool, and was also a great excuse to explore some of my other side ideas).”
In the documentation for Groc, Ian discusses literate programming as the methodology he chose when developing his project. Over the course of building Groc, he says, “my opinion about literate programming changed drastically.  With Docco as my introduction to it, I viewed literate programming purely as an interleaving of comments with source.” As an author of a “literate programming tool,” he thought it wise to study up on the subject, and “devoured” Donald Knuth’s Literate Programming. His conclusion: “Wow, what an over-complex and dated mess it is!”
Ian explains:

As defined by Knuth, literate programming is about writing documentation that can be transformed into code.  After all, his motivation was to be able to publish his projects as books.  His literate programming tools were effectively meta-programming tools: your documentation defined macros and snippets of source; tangle would read that and spit out generated source, while weave would take the same input and spit out generated documentation. I very quickly formed the opinion that the ‘pure’ literate programming approach was not very compatible with current trends and projects.  However, the spirit of literate programming is eminently applicable to code from any era: Source code should be written such that it is easily understood by and organized for humans.  Most code you see today is written for the machine first, human second. In practice, this means you apply a few methodologies (that differ from traditional source writing):


Source code should be grouped by concept, much as you’d group content for a reference book. This applies at many levels (file and directory organization, sections within a file, method grouping within a class, etc).
For example, the file structure of a Rails project is the antithesis of logical grouping.  Files for each concept are strewn throughout the project (very consistent naming, and easy for a machine; but not always friendly to the human).  LP can mean more work for tools.
Or, within a class definition: it is common to see methods grouped by their visibility; whereas it is often much clearer to the human if public methods and the private helpers they call are grouped more closely together.
Source should have a narrative.
When method documentation talks about optional behavior; those comments should be located with the code that implements that optional behavior. In practice, this often means heavily reorganizing conditional logic and adopting a flat style (avoid nested conditionals).
Similarly, the file/directory organization should try to minimize the amount of seeking that someone needs to perform in order to understand the source. They should be able to, ideally, read straight through the files in some order.

As for the inspiration for Groc, Ian recalls having a “very long” brainstorming session of names that seemed similar to Docco (it being the inspiration), but different enough to not confuse people. “At some point I combined ''doc’ and ''grok,’ and it stuck as a fantastic name: you want to grok your source and documentation, after all." 

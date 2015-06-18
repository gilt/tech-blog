---
layout: post
title: Pour a Little (Lucene) Sugar in Your Scala
date: '2013-07-18T11:10:00-04:00'
tags:
- Scala
- lucene
- gilttech
- API
- search
- lucene sugar
- libraries
tumblr_url: http://tech.gilt.com/post/55783527640/lucene-scala
---

Please say hello to Lucene Sugar: a library that provides a more concise syntax for the Lucene API in the Scala language. Lucene Sugar makes it easier to:
compose Lucene indexes using the familiar Scala cake pattern
add indexed and/or stored fields to a Lucene document
index collections of documents
search! (You didn’t really expect that, did you?)
My general goal for Lucene Sugar is to turn some standard operations on their head. For example, instead of:
scala val doc = new Document doc.add(new StringField("string_field", "aString", Store.YES)) doc.add(new LongField("long_field", 123456L, Store.NO)) doc.add(new StoredField("int_field", 10))
you can now write:
scala val doc = new Document doc.addIndexedStoredField("string_field", "aString") doc.addIndexedOnlyField("long_field", 123456L) doc.addStoredOnlyField("int_field", 10)
Lucene Sugar is still in its infancy, but I believe it already offers great value to anyone wishing to use Lucene in Scala code.
Why I Created Sugar
Gilt’s inventory includes millions of different items in limited quantities. These items are sold quickly, which means that our inventory is constantly changing. A few weeks ago I found that I needed a data store capable of:
storing items composed of text and numbers
being indexed and filtered using extremely specific criteria (for example, all white shirts from Paul Smith that can be shipped to Canada)
working quickly and efficiently (a few 100ms per query)
being embeddable (I wanted the data management to be self-contained in the service without requiring any external dependencies
I’d used Lucene for other projects, and thought it might be a great fit for what I needed. In fact, it turned out that–despite its wordy API–Lucene works very well. To overcome the excess verbiage issue, I added some “Scala syntactic sugar” around the Lucene API to make it more concise and pleasant to use. After doing some coding, I realized that it could be helpful to convert this higher-level API into a library that could be reused in other projects. (I also badly wanted to publish my first open source Scala project, so this was a very good candidate.)
With Lucene Sugar, we can now build a search and browser service on top of our inventory data; the data is composed of textual attributes such as product name, brand, color and description as well as numeric data like price and size. I hope you find it useful as well!
Photo by Uwe Hermann. Creative Commons license.

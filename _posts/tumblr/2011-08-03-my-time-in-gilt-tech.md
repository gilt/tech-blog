---
layout: post
title: My Time in Gilt Tech
date: '2011-08-03T17:17:00-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/8441805662/my-time-in-gilt-tech
---
I walked into the office one morning to see my boss doing push-ups. Pictures were being taken and videos recorded. As a relatively new intern at the time, I was confused. It turned out he had answered a question with the word “mine,” breaking the only rule of the “Game of Life” at Gilt Tech. That type of thing isn’t too unusual at Gilt – its culture encourages this sort of playful hazing team building exercise.
Tech at Gilt is kind of its own community. How couldn’t it be? Nerds love nerding out with other nerds (and our tech team is full of nerds). Github and twitter accounts are common here, and we use plenty of open source software. One of Gilt Tech’s newer goals is to start contributing to the open source community, exemplified here in Mothership and in my own gem RubyXL.
RubyXL is a gem which provides an API for programmatically modifying content and formatting of Excel’s .xlsx and .xlsm formats, while preserving macros, drawings, and all content when parsing and writing. Currently, a couple of gems exist for xlsx files, but they are often missing core functionality (e.g. parsing, writing, the modification of styles, or the preservation of macros). RubyXL solves this, with an easy to understand structure and a simple set of calls to make all these modifications.
One of the potentially more useful functions is the ability to extract a table from a worksheet and store it in a hash, given an array of headers/columns. If you know a table exists in an excel file which has columns “Name”, “Age”, and “Height”, the get_table function will search within the worksheet for a row with those 3 strings (they can be in any order, and the row could have more content, but those cells will be ignored), and will return a hash which is searchable both by row and column. The hash might look something like this:
> workbook.worksheets[0].get_table(["Name","Height","Age"])=> {:Name=>["John", "Jane", "Joe"], :Height=>[70, 65, 68], :Age=>[30, 25, 35]
:table=>[     {:Name=>"John", :Height=>70, :Age=>30},     {:Name=>"Jane", :Height=>65, :Age=>25},      {:Name=>"Joe", :Height=>68, :Age=>35}]}
If you feel like using it or if you want more information, check it out on Github. And if you want to work on the Gilt Tech Team, go here.

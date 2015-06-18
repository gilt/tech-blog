---
layout: post
title: 'Responsive Gilt.com: Block vs. In-selector Media Queries'
date: '2014-07-02T16:30:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Special Operations
- Play Framework
- responsive design
- mobile
- how-to
- Response.js
- Gregory Mazurek
- Greg Mazurek
- software engineering
- CSS
- DOM
- stylesheets
- media queries
- developer happiness KPI
- polyfill
- responsive design series
tumblr_url: http://tech.gilt.com/post/90586369504/responsive-gilt-com-block-vs-in-selector-media
---
This is the second of five posts the Special Operations team is sharing on what we learned while making legacy applications responsive to mobile devices. In our first post, we gave a high-level overview of how we organized a successful team retrospective. In this post, I’d like to dig a little deeper into the technology side of our work and discuss how to organize media queries.
CSS3 media queries enable you to present content to a specific range of devices without having to change the DOM. If you have a view, you can use media queries to let your users see content that fits well on a mobile device, a tablet, or a desktop screen. Media queries make it easy to make separation of concerns within stylesheets without having to change the underlying DOM structure.
A media query generically looks like this:
https://gist.github.com/GregM/78a0c272ff60e388aae9
At Gilt, we think a lot about how to use media queries so that they scale across many applications and many, many CSS files. Responsive design only increases the amount of complexity in an application. When you use media queries, your CSS files become longer, and changing the DOM becomes much riskier. 
To limit the degree of complexity we’re adding–and also increase Gilt’s developer happiness KPI–we’ve adopted two useful patterns for using media queries. First, we establish variables that define our viewport breakpoints, and we reference these variables throughout all of our .less files. Our four breakpoints try to capture device widths that fit a desktop/laptop, a tablet in landscape mode, a tablet in portrait mode as well as a phone in landscape mode, and a phone in portrait mode. They are:
https://gist.github.com/GregM/f0f07fe6501808aef99a
If the variables change at any point, all of our .less  files will pick up these changes. 
It’s important not to include “@media” in your variables, because you’ll sometimes want to reference multiple media in one query. For example:
https://gist.github.com/GregM/b59eae5ac3822172392f
The second pattern surfaced as a result of large, gnarly CSS files. When we first started adding media-queries to legacy CSS files, we added large media-query blocks to the end of each file. We did this because wanted to support IE7 (ugh… and of course, IE7 doesn’t support media queries). So, our .less  files looked like this
https://gist.github.com/GregM/4183a4e2a88140f2cc68
This pattern is OK if your file is small, but becomes quite burdensome when the CSS is so long that the media queries are hundreds of lines away from the selectors that they override. You might have a selector at line 2 that is overwritten for a specific media in line 300. This creates significant opportunities for errors. An engineer working on a selector on line 2 might not think about scrolling to line 300 to change the appropriate property in a media query below.
While we were progressing with our work, Respond.js appeared. Respond.js is an open-source polyfill that handles CSS3 properties like @media for IE6, IE7, and IE8, and enables you to include your media queries anywhere. We started using it at Gilt to avoid having to place our media queries at the end of our CSS files.
Which brings me to our second media query design pattern: we use inline media-queries on CSS selectors rather than placing the CSS selectors in media-query blocks. For example, we can now write the above code sample like this:
https://gist.github.com/GregM/90a2bfa299129734748a
Given this short code sample, the developer happiness gain here might not be immediately obvious. If you include the media query in each CSS selector, your engineer knows all the locations where the properties are being overwritten. This limits the chances for changes that unknowingly impact media queries elsewhere. We’ve relied upon inline media queries to keep the separation of concerns in check for us.
To summarize: We highly recommend creating variables to handle your media queries and writing your media queries inside the CSS selectors that they modify. With these two patterns, we think your responsive design workflow will be easier to maintain in the future.
Tune in next Monday (July 7, after the American holiday) for “Responsive Gilt.com: Selenium Edition”! 

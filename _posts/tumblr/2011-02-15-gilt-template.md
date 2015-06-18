---
layout: post
title: Gilt's JavaScript Templating Architecture
date: '2011-02-15T10:02:00-05:00'
tags:
- frontend
- javascript
- templating
- gilt
- gilttech
- Eric Shepherd
- Handlebars
- Gilt.Template
- Dust
- architecture
- submission
tumblr_url: http://tech.gilt.com/post/3309612608/gilt-template
---
Templating is a powerful way of separating concerns on the front end. It’s a natural fit for Gilt’s platform, since much of our content comes to the front end from services that return JSON. Sometimes that JSON is rendered in JSPs with JSTL, but sometimes it’s better to render it with JavaScript.

Until recently, most JavaScript HTML rendering involved messy string concatenation, lots of looping, and an unholy marriage of logic and content in the same file. However, new templating engines, such as Handlebars, allow multiple logic-less templates to be created for the same content, with clean, easy-to-read syntax. Compare:




But which template engine to use? There are many currently vying for prominence. I didn’t want to hitch our wagon to any one engine, since many different pieces of Gilt code need to make templating calls and none of us knows the future, so I decided to create a middle-tier API that would accept any templating engine as a plugin. This is generally a good way to approach front end architecture, as it’s all too easy to scatter third-party dependencies throughout a large codebase, leading to difficult maintenance and requiring significant restructuring if the third-party code ever needs to be changed.

What It Is

There are three components in addition to the implementation code:

Gilt.Template, which exposes render(), register(), plugin.add() and plugin.get() methods
a template file saved using a directory and file naming convention
the chosen rendering engine code
How It Works

Templates are stored in a Gilt.Template private cache, by a unique combination of name, engine, and version. Name is typically the type of feed or data that is being rendered, such as a wait list, a single product feed, or a cart. Version indicates which view of the data is required (“default” is the canonical view, and views can exist for third-party sites or other areas on the Gilt site such as a modal window or a specific page). Engine indicates which third-party rendering to use, with Handlebars as the default if none is specified.
For flexibility, all rendering is asynchronous. The render() method does not actually write any markup; instead, it supplies the rendered markup to a passed callback function. This allows the template file or rendering engine to be lazy loaded at the time of invocation, rather than be already present on the page, and it recognizes that often the rendered template is needed for purposes other than writing immediately into an element on a page.
Each template engine is an equal citizen, registered as a plugin with Gilt.Template. Handlebars and Dust are built-in, as we use both of them on the Gilt site; however, any additional template engine can be registered and used. Each plugin must provide a render() method, and optionally can provide a register() method (used, for example, in Dust compilation). When the implementation code calls Gilt.Template.render(), that method delegates to the plugin’s render() method.
If the template is not available in Gilt.Template’s cache, it triggers an asynchronous load of the template file, looking by a naming convention of /templates/<type>/<version>.<engine>.js. For example, a template that handles the default view of a wait list feed using Handlebars would be stored at /templates/wait_list/default.handlebars.js. This convention allows for multiple views of the same data feed. Gilt.Template.render() takes an optional argument for an ajax service to use, with jQuery used by default. This allows for the possibility of use with a different base library, since this is the only point of third-party dependency.
How To Use

So, the three steps required to use the system are:


Add a plugin using Gilt.Template.plugin.add() with the specific code required to interact with the chosen third-party templating engine. Handlebars support is built-in and, for reference, looks like this:

// <![CDATA[

// ]]>


Register a template with Gilt.Template.register(), indicating a unique combination of name, engine, and version. This could be done prior to calling render(); if not, render() will lazy load this template file, thereby calling register():

// <![CDATA[

// ]]>


Call Gilt.Template.render(), passing it the unique name, engine, and version to render, along with a callback to be provided with HTML. The render() method will load the plugin and call register() first if the template is unavailable. The following code is probably in the callback of an ajax request function:

// <![CDATA[

// ]]>

tl;dr;

In summary, Gilt.Template:

allows for template storage by engine, version and name;
provides flexibility by providing rendered markup to a callback function;
treats all templating engines equally; and
speeds up page load by asynchronously loading template files.
Templates have helped us to separate our content data from its views on the site, and our middle-tier architecture has provided a consistent API and eliminated the need for third-party calls in the Gilt codebase.

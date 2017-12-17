---
layout: post
title:  Linting NPM Version Conflicts
author: Andrew Powell
date: 2016-11-09
categories: 
- node
tag:
- npm
- node.js
- open source
redirect_to:
- https://tech.hbc.com/2016-11-09-linting-npm-version-conflicts.html
---

Say you had the need for shared front-end assets (scripts, stylesheets, images,
etc.) and a need for an entire org to access them, independently, for reliable
builds of many different apps which used those assets. NPM might be a good
choice - With NPM's move to a [flat-ish install tree](https://docs.npmjs.com/how-npm-works/npm3),
it's still a relevant choice. But what about package version conflicts?

<!-- more -->

At Gilt, the choice was made years ago; before Bower, JSPM, and the host of other
package managers came to be. NPM was the logical choice then. And we're still
using it.

## Tooling

Traditionally hard. With the nested NPM installs of yesteryear it was compounded.
Not only did we have to detect and move around scripts and other assets from
within module packages, we also had to check versions against one another. That
was essential in building the final script bundles and combining css for a
production deployment.

### The Scenario

Let's say that fictitious `module-a` depends on `module-b` and `module-util`. And
that `module-b` also depends on `module-util`. That's a pretty straightforward
tree and the bundle for the scripts of that tree should be easy. You'd think.
But consider that scenario if `module-a` depends on `module-util@1.0.0` and
`module-b` depends on `module-util@0.5.0`. Now we've got a conflict, and that
could totally hose our production bundle.

### The Trees

In prior versions of NPM, the `npm install` tree would look like this:

```
node_modules
  module-a
    node_modules
      module-util@1.0.0
      module-b
        node_modules
          module-util@0.5.0
```

In today's NPM it looks like this:

```
node_modules
  module-a
  module-util@1.0.0
  module-b
    node_modules
      module-util@0.5.0
```

NPM is quarantining outlier versions of shared modules so that everything plays
nicely in a Node.js environment. That's cool for Node, but not for us... using
this as a front-end assets package manager.

### A Solution?

What we ended up doing was installing the entire package tree to a temporary
directory, and then polling every package.json in that directory, building a
dependency tree and looking through the tree for conflicts. It worked. It wasn't
a bad method, and it's one that we duplicated in three generations of tooling.

## A Better Solution

That's a heck of a lot of work to perform after we make NPM do a heck of a lot
of work. There's a better, faster way. Using NPM's ability to pull metadata
quickly for modules, we can leverage Node 7's async/await capabilities to
produce some elegant code that quickly retrieves and maps an NPM module's
version dependency tree.

<script src="https://gist.github.com/shellscape/c262ec5d74811525b1fe8c7e26a2c7e1.js"></script>

Running that script for `koa`, we get:

```js
...
koa: [ { version: '1.2.4', parent: '' } ],
  'koa-compose': [ { version: '2.5.1', parent: 'koa' } ],
  'koa-is-json': [ { version: '1.0.0', parent: 'koa' } ],
  'media-typer': [ { version: '0.3.0', parent: 'type-is' } ],
  'mime-db':
   [ { version: '1.24.0', parent: 'mime-types' },
     { version: '1.24.0', parent: 'mime-types' },
     { version: '1.24.0', parent: 'mime-types' } ],
...
```

In which we can clearly see that there are no version conflicts. That's a snippet
of the much larger tree returned, but the result is the same. Running that script
on our fictitious `module-a`, the result would look like:

```js
{
  'module-b': [ { version: '0.0.1', parent: 'module-a' } ]
  'module-util': [
    { version: '1.0.0', parent: 'module-a' },
    { version: '0.5.0', parent: 'module-b' },
  ]
}
```

And our conflict is visible.

## Robustednesseses

While interesting, this isn't inherently useful by itself. Moving forward, we'll
be wrapping this into a [Gulp](http://gulpjs.com) plugin with proper reporting
output and blocking, and run from the local `package.json` file.

### Cheers!

*Originally published at
[shellscape.org](http://shellscape.org/2016/11/09/linting-npm-version-conflicts) on
November 9, 2016.*

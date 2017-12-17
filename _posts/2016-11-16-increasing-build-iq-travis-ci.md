---
layout: post
title:  Increasing Build IQ with Travis CI
author: Andrew Powell
date:   2016-11-16
categories: 
- continuous integration
tag:
- continuous integration
- node.js
- open source
- travis ci
redirect_to:
- https://tech.hbc.com/2016-11-16-increasing-build-iq-travis-ci.html
---

Continuous Integration is a must these days. And for social, open source
projects it's crucial. Our tool of choice for automated testing is
[Travis CI](https://travis-ci.org/). Like most tools, Travis does what it does
well. Unfortunately it's not very "smart". Heaven help you if you have a large
or modular project with a multitude of tests - you'll be waiting an eternity
between builds.

<!-- more -->

And that's exactly what we ran into. We have a repository that contains *30 NPM
modules*, each with their own specs (tests). These modules are part of an aging
assets pipeline that I
[briefly mentioned](http://tech.gilt.com/node/2016/11/09/linting-npm-version-conflicts)
last week. As such each module is subject to a litany of tasks each time a change
is made. Travis CI is hooked into the repo and for each Pull Request would run
specs for every module, assuring that there are no errors in the code changes
contained in the PR. When you're only working on one or two modules the run-time
for the tasks is relatively low; typically 1 - 2 minutes. That of course depends
on things such as `npm install` time, as each module requires an install for testing.
*Multiply that by 30* and you start to see where the problem arises.

## Waiting Sucks

Without targeted build testing we're left waiting or task-shifting until the
build completes successfully. Our need was clear: figure out what files were
affected, map and filter the results, and run only the specs for the modules
changed in any particular Pull Request or push. That's where
[travis-target](https://www.npmjs.com/package/travis-target) comes into play.

Here's a snippet of our repo structure, for reference:

```bash
ui-tracking
|--src
   |--common
      |--event_registry
      |--tracking_metadata
   |--tracking
      |--cart
      |--etc..
```

## Target Acquired

In order to target modules, we need to know what their normalized names are; the
names that we publish them to NPM under. Because of some legacy stuff baked into
our pipeline, we store modules at `group/name` but publish them as `group.name`.
So let's fire up `travis-target` (bear in mind we're using ES6 syntax that Node v7 supports).

```js
const target = require('travis-target');
const pattern = /^src\//;

let targets = await target();
```

Let's pretend that the `common.event_registry` and `tracking.cart` modules were
both modified in one Pull Request (a common pattern for us) - our results
would could look like this:

```js
[
  'README.md',
  'src/common/event_registry/js/event_registry.js',
  'src/common/event_registry/js/registry.js',
  'src/common/event_registry/package.json',
  'src/tracking/cart/js/cart.js',
  'src/tracking/cart/package.json'
]
```

But that's just silly, so let's give `travis-target` some options to work with:

```js
const target = require('travis-target');
const pattern = /^src\//;

let targets = await target({
  pattern: pattern,
  map: (result) => {
    let parts;

    result = result.replace(pattern, '');
    parts = result.split('/');

    return parts.slice(0, 2).join('.');
  }
});
```

By passing `pattern` in options, we're telling `travis-target` to filter on (or
return only those results which match) the regular expression pattern. That gives
us an initial result set of directories starting with `src/`.

```js
[
  'src/common/event_registry/js',
  'src/tracking/cart/js'
]
```

You'll notice that the initial example of results contained some duplicate
directories; travis-target cleans that up for you.

Next, we specify the `map` function on options. That'll let us transform the each
element in the `Array` of results so that it's ready to use. Our results would
now look like this:

```js
[
  'common.event_registry',
  'tracking.cart'
]
```

## Great Justice

Using this last result set, we now know which modules were affected in the PR,
and we know which modules to run specs for. Our next steps are firing off a
sequence of shell commands using
[@exponent/spawn-async](https://www.npmjs.com/package/@exponent/spawn-async),
which plays nicely with `async/await` patterns now supported in Node v7.1 with
the `--harmony-async-await` flag.

Since we implemented this pattern, build times for our PRs are in the 1-2 minute
range; a vast improvement and one sure to bring developer happiness in some small
degree.

### Cheers!

*Originally published at
[shellscape.org](http://shellscape.org/2016/11/16/increasing-build-iq-travis-ci) on
November 16, 2016.*

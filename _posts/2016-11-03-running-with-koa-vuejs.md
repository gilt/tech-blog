---
layout: post
title:  'Running with Scissors: Koa2 and Vue.js'
author: Andrew Powell
date: '2016-11-04'
categories: 
- node
tag:
- koa2
- node.js
- open source
- vue.js
- webpack
redirect_to:
- http://tech.hbc.com/2016-11-04-running-with-koa-vuejs.html
---

We love [Koa](http://koajs.com/) at Gilt. (Hell, *I* love Koa.) Embarking on a new
project, I wanted to try something that wasn't React or Angular. After poking at
the alternatives I landed on [Vue.js](https://vuejs.org/). I picked up the sharpest pair of
scissors I could find and started running.

<!-- more -->

## The Chosen Tech

If you haven't heard of Koa:

> Koa is a new web framework designed by the team behind Express, which aims to
be a smaller, more expressive, and more robust foundation for web applications
and APIs.

Koa is Express without the bells and whistles from the factory. Koa is the stock
car that you bolt aftermarket parts onto, based on your needs. It's fast as hell.
It's small. It's a dang joy to work with. Koa2 improves on performance and makes
use of await/async patterns.

If you haven't heard of [Vue.js](https://vuejs.org/);

> Vue is a progressive framework for building user interfaces. ...Vue is
designed from the ground up to be incrementally adoptable. ...is focused on the
view layer only, and is also perfectly capable of powering sophisticated
Single-Page Applications.

Basically Vue.js takes the good parts from React, Angular, and Aurelia and bundles
them into a single lib. [Who want's to go fast?](https://www.youtube.com/watch?v=gnA1Q2JvvJo).
React folks won't like it because there's no JSX and there's two-way binding. I
dig it explicitly because I personally think JSX is an abomination, but more
specifically that Vue.js uses `<templates>` which are very close to web components
and will make that transition easy in the future, if and when wide-spread support
for them ever drops. I digress.

## Setting Up

It's worth noting that we're using Node v7, which supports most ES5 and a lot of
ES6 syntax, with [BabelJS](http://babeljs.io) thrown in to fill the gaps.

### Koa

I always start my Koa projects with a few base modules: koa (duh),
[koa-router](https://www.npmjs.com/package/koa-router), and
[koa-static](https://www.npmjs.com/package/koa-static). `koa-static` allows you
to specify and serve one or more directories as static assets - a necessity.
`koa-router` typically handles app routes; that is to say the different endpoints
for your app. The code is pretty straight forward, here's a basic `app.js`:

```js
'use strict';
import 'colors';
import Koa from 'koa';
import serve from 'koa-static';

const app = new Koa(),
  port = 3000;

app
  .use(serve(`${__dirname}/public`))
  .listen(port, () => {
    console.log('Server Started ∹'.green, 'http://localhost:'.grey + port.toString().blue);
  });

export default app;
```

### Vue.js

To start off a project with Vue, we used [vue-cli](https://github.com/vuejs/vue-cli).
That allows us to create boilerplate apps. Since we're running with scissors here,
we jumped right in and went with the simplest template.

```bash
$ vue init webpack-simple .
```

That gives us a basic (as in pumpkin spice latte) Vue app which displays a single
page at `index.html` with a logo and some links. That also generates the
`App.vue` file, which is the main "Vue file" for the app. All of that resides in
`src` now. That's all well and good, but what about that Webpack file created?

### Enter Webpack

Getting a Vue app working right means bundling correctly. We use Webpack, but
there are a lot of examples out there with Browserify if you prefer that.
[Webpack](https://webpack.github.io/) is a wonderful bundling tool and can
perform a host of functions. So much so that it can be considered a full-fledged
build tool. You'll need a `webpack.config.js` file to kick things off:

<script src="https://gist.github.com/shellscape/359caf7243e7f53d7ff2d60e41f637c3.js"></script>

And then you'll need Webpack itself:

```bash
$ npm install webpack -g
```

You'll note that we did a few things different with `webpack.config.js`, beyond
what the `vue-cli` generated for us; moved assets to `assets` and introduced
a Webpack Plugin to combine CSS in Vue files into one single CSS file to be served
by Koa.

## Tying it together

If you're following our example and using Babel as well, you'll need a Node
entry point file to set Babel up for development. We named this `index.js`:

```js
require('babel-core/register');
require('babel-polyfill');
require('./app');
```

Assuming you have a solid `.babelrc` and your dependencies setup correctly,
you're ready to try running this beast. First, fire up Webpack and create your
bundles:

```bash
$ webpack
```

Assuming everything succeeded, you're ready to start the server:

```bash
$ node index
```

And you should see something like this in your console:

```bash
→ node index
Server Started ∹ http://localhost:3000
```

Hit that address in your browser and you should see the Vue demo app. How do you
like them apples? I love 'em.

## Running With Machetes

We've conquered scissors, let's get silly and run around with something larger
and sharper - in a following post I'll walk through using middleware with Koa2
to allow live development and Hot Module Reloading. That means you don't have to
restart your server to rebuild your bundles, and you see changes nearly instantly.
It's cool, right?

### Cheers!

*Originally published at
[shellscape.org](http://shellscape.org/2016/11/04/running-with-koa-vuejs) on
November 3, 2016.*

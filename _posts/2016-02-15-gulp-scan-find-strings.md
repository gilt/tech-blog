---
layout: post
title: gulp-scan &bull; Find Yourself Some Strings
author: Andrew Powell
date: '2016-02-15'
categories:
- gulp
tags:
- gulp
- javascript
---

We recently ran across the need to simply scan a file for a particular term during
one of our build processes. Surpringly enough, we didn't find a [Gulp](https://gulpjs.com)
plugin that performed only that one simple task. And so [gulp-scan](https://www.npmjs.com/package/gulp-scan)
was born and now resides on [npmjs.org](https://npmjs.org).

Simply put - gulp-scan is a Gulp plugin to scan a file for a particular string
or (regular) expression.

## Setting Up

As per usual, you'll have to require the module.

```js
var gulp = require('gulp');
var scan = require('gulp-scan');
```

## Doing Something Useful

```js
gulp.task('default', function () {
  return gulp.src('src/file.ext')
		.pipe(scan({ term: '@import', fn: function (match) {
			// do something with {String} match
		}}));
});
```

Or if RegularExpressions are more your speed:

```js
gulp.task('default', function () {
	return gulp.src('src/file.ext')
		.pipe(scan({ term: /\@import/gi, fn: function (match) {
			// do something with {String} match
		}}));
});
```

Pretty simple. There's always room for improvement, and we welcome contribution on [Github](https://github.com/gilt/tech-blog).

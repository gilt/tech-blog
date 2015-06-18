---
layout: post
title: 'Shmock: An Express-Based HTTP Mocking Library for Node.js'
date: '2014-03-07T16:17:00-05:00'
tags:
- Gilt
- Gilt Tech
- Gilt Groupe
- open source
- Jonathan Leibiusky
- xetorthio
- Node.js
- mocking libraries
- Nock
- TJ Holowaychuk
- Express
- Shmock
- SuperAgent
tumblr_url: http://tech.gilt.com/post/78877878592/shmock-an-express-based-http-mocking-library-for
---
We’re excited to introduce the latest open source project by Gilt Principal Systems Engineer (and Docker talker) Jonathan Leibiusky: Shmock, an HTTP mocking library based on Express. If you’re not familiar with Express, it’s an open-source, Sinatra-inspired web development framework for Node.js created by Canadian developer/Luna author TJ Holowaychuk. It’s pretty great!
Jon created Shmock to avoid the hassles and errors that typically arise whenever developers attempt to change the behavior of mocking functions. “Compared to nock and other well-known HTTP mocking libraries for Node.js,” Jon says, “Shmock offers a distinct advantage in that it is based on a real HTTP server (Express). This means that you can use Shmock to make HTTP requests without changing the behavior of Node’s native APIs or common HTTP libraries. No matter how you make your HTTP requests, or which version of Node.js you use, Shmock will work correctly.” And like SuperAgent–an Ajax API, also created by Holowaychuk–Shmock is lightweight and easy-to-use.
To help you get started:
Installation
$ npm install shmock

Usage
Initialize with or without port

var shmock = require(''shmock'');

var mock = shmock(); // will give some arbitrary port

var mock2 = shmock(9000); // will use port 9000


Define expectations
On http methods

mock.get("/foo").reply(200, "bar");


On http headers

mock.get("/foo").set("Authorization", "123456").reply(200, "bar");


On querystring parameters

mock.get("/foo").query("a=bi&c=d").reply(200, "bar");
mock.get("/foo").query({a: "b", c: "d"}).reply(200, "bar");


On request body

mock.post("/foo").send({a: "b"}).reply(200, "bar");
mock.post("/foo").send("123456").reply(200, "bar");


Add a delay to the reply

mock.get("/foo").delay(500).reply(200);


Make assertions on the handler
Check if expectation has been met

var handler = mock.get("/foo").reply(200);
...
...
handler.isDone.should.be.ok;
handler.done(); // Throws an error if isDone is false


Wait for expectation to be met

var handler = mock.get("/foo").reply(200);
...
...
handler.wait(function(err) {
  if(err) {
{% endhighlight %}
  }
});


You can also specify a timeout in ms:

handler.wait(200, function(err) { ... });


Or if using mocha:

handler.wait(200, done);


Make sure to view the test for examples. And check out Jon’s other recent projects: Goblin and GoReq!

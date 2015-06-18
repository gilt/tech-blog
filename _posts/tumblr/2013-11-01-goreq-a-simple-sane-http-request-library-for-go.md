---
layout: post
title: 'GoReq: A Simple, Sane HTTP Request Library for Go'
date: '2013-11-01T17:39:00-04:00'
tags:
- Golang
- Jonathan Leibiusky
- Goblin
- GoReq
- Go programming language
- open source
- HTTP request
- JSON
- APIs
tumblr_url: http://tech.gilt.com/post/65724312210/goreq-a-simple-sane-http-request-library-for-go
---


Go has very nice native libraries that allows you to do lots of cool things. But sometimes those libraries are too low-level, which means that to do something simple–for example, make an HTTP request–takes way too much time. Even something like adding a timeout to a request can require writing several lines of code.
To make things easier for other Go enthusiasts, Gilt Principal Systems Engineer Jonathan Leibiusky and his friend Marcos Nils (the same duo behind the Goblin testing framework) created GoReq: a simple and sane HTTP request library for Go. With GoReq, you can make all your requests in a very simple and comprehensive way. You can also:
Send payloads in the body
You can send string, Reader or interface{} in the body. The first two will be sent as text. The last one will be marshaled to JSON, if possible:

type Item struct {
    Id int
    Name string
}

item := Item{ Id: 1111, Name: "foobar" }

res, err := goreq.Request{ 
    Method: "POST", 
    Uri: "http://www.google.com", 
    Body: item,
}.Do()


Specify request headers
The request headers that you probably use most often are Host, Content-Type, Accept and User-Agent. This is why Jon and Marcos decided to make it super-easy to set these headers:

res, err := Request{
    Uri: "http://www.google.com",
    Host: "foobar.com",
    Accept: "application/json",
    ContentType: "application/json",
    UserAgent: "goreq",
}.Do()


However, sometimes you need to set other headers. With GoReq, you can:

req := Request{ Uri: "http://www.google.com" }

req.AddHeader("X-Custom", "somevalue")

req.Do()


Set Timeouts
GoReq supports two kinds of timeouts: A general connection timeout and a request specific one. By default, the connection timeout is one second. There is no default for request timeout, which means it will wait forever.
With GoReq, you can change the connection timeout by doing this:

goreq.SetConnectionTimeout(100 * time.Millisecond)


And specify the request timeout doing:

res, err := goreq.Request{ 
    Uri: "http://www.google.com",
    Timeout: 500 * time.Millisecond, 
}.Do()


Use the Response and Error
GoReq will always return two values: a Response and an Error. If Error is not nil, it means that an error occurred while you were making  the request and you shouldn’t use the Response in any way. You can check what happened by getting the error message:

fmt.Printlm(err.Error())


To easily figure out whether the error was a timeout error, you can either ask the error or return it:

if serr, ok := err.(*goreq.Error); ok {
    if serr.Timeout() {
        ...
    }
}
return err


If you don’t get an error, you can safely use the Response:

res.StatusCode //return the status code of the response
res.Body // gives you access to the body
res.Body.AsString() // will return the body as a string
res.Header.Get("Content-Type") // gives you access to all the response headers


Receive JSON
GoReq will help you to receive and un-marshal JSON.

type Item struct {
    Id int
    Name string
}

var item Item

res.Body.FromJsonTo(item)


Interested in contributing? Feel free to send Jon and Marcos your pull requests.

---
layout: post
title: "RESTful API Design Principles"
author: Peizan Wang
date: '2016-06-24'
categories: 'api'
tags:
- restful
- api design
- hypermedia
---    


> This post is translated from [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html), which is originally written in Chinese under the [CreativeCommons License](https://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh), and the license prohibited me from modifying the article.

## Protocal   

All RESTful APIs should communicate with clients under the **HTTPS** protocal.

## Domain Name   

If it's possible, APIs should be placed under a special domain name. e.g.   
``` https://api.example.com```        

However, if it's quite sure that APIs are very simple and won't change significantly, it's also reasonable to put it under main domain. e.g.    
```https://example.com/api/```    

## Versioning

Version number should be put in the URL of all APIs. e.g.   
```https://api.example.com/v1/```     

Another approach is to put it in HTTP header, but this is not as intuitive as the previous one. (e.g. APIs of Github have such a field in their headers 
```X-GitHub-Media-Type: github.v3```)    

## Endpoint

Endpoints are concrete URLs for APIs. i.e. They serve as the entrance for APIs.    
In RESTful design, each URL points to a resource. Thus, a well-formed RESTful URL contains only nouns, no verbs.     
For example, suppose there is a set of APIs which provide infomation about zoos, animals and zoo employees. Then the URLs could be like:   
* ```https://api.example.com/v1/zoos```    
* ```https://api.example.com/v1/animals```     
* ```https://api.example.com/v1/employees```     

## HTTP Verbs

HTTP verbs represent a certain **operation** on a certain **resource** identified by URL.   
There are five common HTTP verbs:   
* ```GET``` : Retrive a resource from server.
* ```POST``` : Create a new resource in the server.
* ```PUT``` : Update a resource in server. (Client provides an entire new resource to replace the original one)
* ```PATCH``` : Update a resource in server. (Client provides part of the properties to be updated)
* ```DELETE``` : Delete a resource from the server.     

And there are two more verbs which are not usually used:    
* ```HEAD``` : Get the HTTP header of a resource.
* ```OPTIONS``` :  Get a list of HTTP verbs, which could be used on this resource.     

For example:    
* ```GET /zoos``` : List all the zoos.
* ```POST /zoos``` : Add a new zoo to all zoos.
* ```GET /zoos/ID``` : Get information about a certain zoo with id: ID.
* ```PUT /zoos/ID``` : Update the information about a certain zoo. (All information about the zoo shall be provided by client)
* ```PATCH /zoos/ID``` : Update the information about a certain zoo. (Only part of the information about the zoo will be provided by client e.g. name and location)
* ```DELETE /zoos/ID``` : Delete a certain zoo from the list of zoos.


## Filtering

If one resource has too many items, the server could choose to return only a subset of them to the client, and provides the client with some parameters to filter the results. 

For example:    
* ```?limit=10``` : Return only 10 records.
* ```?page=2&per_page=10``` : Return the records in the 2nd page, if each page contains 10 records.

The design of parameters could be redundant, which means both ```/zoo/ID/animals``` and ```/animals?zoo_id=ID``` refers to the same resource.    

## Status Codes

A respond from server could have no content, however, each responde MUST contains a **status code**.    
* ```200 OK``` : The resource that client asked is successfully returned. *And also, the request caused 200 is idempotent.*
* ```201 CREATED``` : Client has successfully created or updated a resource.
* ```202 ACCEPTED``` : The request has been accepted but the server chooses to process it later.
* ```204 NO CONTENT``` : The resource has been successfully deleted.
* ```400 INVALID REQUEST``` : There is some error in the request sent by client. And the server hasn't done anything with the request.  *And also, the request caused 400 is idempotent.*
* ```401 UNAUTHORIZED``` : The client has not been authorized, which typically means the server cannot identify the client.
* ```403 FORBIDDEN``` : The client has been authorized (opposite to 401), but the client doesn't have the access to requested resource. 
* ```404 NOT FOUND``` : The resource requested by the client doesn't exists. And the server hasn't done anything with the request. *And also, the request caused 404 is idempotent.*
* ```406 NOT ACCEPTABLE``` : The data format listed in the "Accept" HTTP header is not acceptable by the server. e.g. The client requires JSON but the server could only serve XML.
* ```410 GONE``` : The resource requested by client is deleted permanently.
* ```500 INTERNAL SERVER ERROR``` : The server enconters some errors while processing the request, and *the client cannot make any assumption about whether the request has been processed successfullly or not.*


## Error Handling

If the status code is 4XX, the server should send an error message to the client to indicate what kind of error has been encountered.   
For example, if a JSON error message is sent back, that message shall contain a field named *"error"*, whose value is the error message, like:   
```
{
error: "Invalid API Key"
}
```

## Result

The server is **expected** to send back results which follow certain principles to the client:    

* ```GET /collection``` : Return the collection resource. e.g. an array
* ```GET /collection/resource``` : Return a single resource in the collection.
* ```POST /collection``` : Return the new resource which has just been created.
* ```PUT /collection/resource``` : Return the entire resource which has just been updated.
* ```PATCH /collection/resource``` : Return the entire resource which has just been updated.
* ```DELETE /collection/resource``` : Return an empty result.   


## Hypermedia API

It will be very helpful and user-friendly if **hypermedia** is used in RESTful APIs. Because it provides the client with links to other resources, which enables the client to decide what to do next without referring to the documents.   

For example, when the client makes a ```GET``` request to the root domain of ```api.example.com``` , it will get a response like:    
```
{
"link": {
"rel" : "collection",
"href" : "https://api.example.com/zoos",
"type" : "application/vnd.example+json"
}
}
```
Such a response means that there is a link that the client could follow to do more opeations. The relationship between the link and the current response is defined by *"ref"* field, the URL of the resource this link points to is defined by *"href"* field, and the type of document returned by that link is defined by *"type"* field.   

The RESTful API design which uses hypermedia is called [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS). The APIs of github are HATEOAS APIs. If you try to ```GET https://api.github.com``` , you will get a list of available resources' URLs. e.g.:   
```
{
"current_user_url" : "https://api.github.com/user",
"authorizations_url" : "https://api.github.com/authorizations"
// ...
}
```

As you can imagine, if you want to get the infomation about current user, you should follow the URL ```api.github.com/user```, and that will give you:   
```
{
"message" : "Requires authentication",
"documentation_url" : "https://developer.github.com/v3"
}
```   
And that response also gives the client a link to follow, which actually leads to some documentations.

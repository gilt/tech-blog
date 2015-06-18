---
layout: post
title: 'Gilt Lunchtime Tech Talk: "Spray Some NSQ On It"'
date: '2014-04-25T20:00:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- Tech Talks
- Matt Reiferson
- NSQ
- Golang
- realtime distributed messaging
- Torando Labs
- Bitly
- open source
- Ruxy Staicut
- Go programming language
- fault tolerance
- GopherCon
tumblr_url: http://tech.gilt.com/post/83861678913/gilt-lunchtime-tech-talk-spray-some-nsq-on-it
---

Earlier this week Gilt’s tech team in NYC hosted a lunchtime tech talk by Matt Reiferson, the CTO (“Control Tower Operator”) of the New York based consumer web company Torando Labs. Matt’s speaking at this weekend’s GopherCon in Denver, Colo. and came over to do a trial run of his presentation, “Spray Some NSQ On It."His abstract:

NSQ is a real-time distributed messaging platform, built entirely in Go, that promotes distributed and decentralized topologies without single points of failure, enabling fault tolerance and high availability coupled with a reliable message delivery guarantee.
It was built to support Bitly’s data engineering systems and has continued to grow in adoption to power infrastructure at Path, Hailo, Life360, Trendrr, Simplereach, and others. It is a vibrant member of the Go open source community.
Building easy-to-operate, large scale, high volume distributed systems for production tends to present unique and interesting problems that stretch ones assumptions.
This talk is the product of our experience developing NSQ and operating Go services in production.
It covers the evolution of bitly’s infrastructure to the design and implementation of NSQ, a match made in heaven for Go. This includes the challenge of optimizing a garbage collected language, managing those pesky goroutines, and a healthy dose of distributed systems.

You can find NSQ here at Bitly’s GitHub page. Thanks to Matt for spending the afternoon with us, and to Gilt Mobile Engineer Ruxy Staicut for organizing!

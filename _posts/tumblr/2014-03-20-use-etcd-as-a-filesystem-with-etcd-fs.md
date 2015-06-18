---
layout: post
title: Use ETCD as a Filesystem With ETCD-FS!
date: '2014-03-20T20:50:00-04:00'
tags:
- Jonathan Leibiusky
- open source
- ETCD
- ETCD-FS
- Go
- Golang
- open source projects
- Apache ZooKeeper
- ZooKeeper
- Filesystem in Userspace
- FUSE
- CoreOS
- Han-Wen Nienhuys
- go-fuse
- go-etc
tumblr_url: http://tech.gilt.com/post/80215354220/use-etcd-as-a-filesystem-with-etcd-fs
---
Gilt Principal Systems Engineer Jonathan Leibiusky is a fan of ETCD: CoreOS’s extremely powerful, highly-available key value store for shared configuration and service discovery, inspired by Apache ZooKeeper* and written in Go. Jon thought it would be great if ETCD could also be used as a filesystem. Companies that have already deployed apps that read a configuration file from a local filesystem might want to load these config files to something like ETCD and ensure a consistent view across a cluster of nodes. Given that the Filesystem API is super-stable, widely known and supported, and simple, using ETCD in this manner would make a lot of sense.
With this in mind, Jon has created ETCD-FS, which allows you to mount ETCD as a FUSE filesystem. In other words, every existing application can basically start using ETCD as regular files and directories without lots of effort. Implemented in Go, ETCD-FS uses Han-Wen Nienhuys’s go-fuse module and CoreOS’s go-etcd module and works like this:
Every file maps to a key in ETCD
Every directory maps to a directory in ETCD
The content of every file maps to the value of the key in ETCD
How to Install ETCD-FS:
Clone the project and build it:

make build


This generates an executable file etcdfs. You can mount ETCD as a filesystem by running etcdfs MOUNT_PATH ETCD_ENDPOINT. For example:

./etcds /tmp/foobar http://localhost:4001


Then you can access /tmp/foobar and use etcd as a filesystem.
To unmount it:

fusermount -u /tmp/foobar


What ETCD-FS Supports:
Basic filesystem operations, such as:
Reading/Writing files
Creating/Deleting files
Creating/Deleting directories
What’s Next for ETCD-FS
Jon would like to enable users to mount a filesystem to a specific ETCD node (not necessarily or always the root). Less than a week old, ETCD-FS is a work in progress–but Jon creates quickly, so expect this project to become more and more exciting in short order!
* ETCD differs from ZooKeeper in that it’s based on the Raft Consensus Algorithm; ZooKeeper has its own consensus algorithm, called Zab.)

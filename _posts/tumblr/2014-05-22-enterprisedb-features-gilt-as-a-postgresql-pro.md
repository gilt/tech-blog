---
layout: post
title: EnterpriseDB Features Gilt as a "PostgreSQL Pro"
date: '2014-05-22T16:29:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- EnterpriseDB
- PostgreSQL
- databases
- relational databases
- open source
- media
- interviews
- Phong Nguyen
- Point-in-Time Recovery
- write-ahead logs
- Open Enterprise
tumblr_url: http://tech.gilt.com/post/86529703694/enterprisedb-features-gilt-as-a-postgresql-pro
---
EnterpriseDB recently published on its Open Enterprise blog an informative Q&A with Gilt Co-Founder and CTO Michael Bryzek that focuses on our long-time use of PostgreSQL. Read the interview to learn all about the early days of Postgres at Gilt, including the reasons why we chose Postgres over other database technologies and what we continue to value most about it. An excerpt:

Q. What was your biggest surprise or ‘a-ha!’ moment?
Prior to Gilt’s launch, Phong [Nguyen, Gilt co-founder and VP of Research & Development] and I were working through the night to make sure we had a solid footprint for backup and recovery of our data. This meant learning about Point-in-Time Recovery (PITR) and write-ahead logs (WAL). I was blown away by the simplicity of the Postgres system. Each log file was in the filesystem. The log file names sorted lexicographically. The snapshot files sorted correctly—they just had longer names. As newcomers, we were able to read the file in the terminal to obtain very useful information as well as some good pointers on how things worked.
After that first night of digging into how recovery in PostgreSQL worked, both Phong and I felt very confident that the system was incredibly well designed and that we were able to learn enough and to test end-to-end that our data were safe.

Read the full interview here. Then read Gilt’s newly released Postgres case study!

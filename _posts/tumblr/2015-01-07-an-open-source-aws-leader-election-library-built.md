---
layout: post
title: An Open Source AWS Leader Election Library Built in Akka
date: '2015-01-07T13:55:08-05:00'
tags:
- akka
- aws
- ec2
- leader election
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Graham Rhodes
- software engineering
- open source
- OS
- akka-cluster
- AWS
- Amazon Web Services
- Apache ZooKeeper
- leader election library
- aws-leader-election
- Chris Loy
- AWS Java SDK
- Scala
- Akka
- Dublin
tumblr_url: http://tech.gilt.com/post/107425845944/an-open-source-aws-leader-election-library-built
---

Recently I needed a scheduled job inside one of my distributed services: an open-source Play application with at least two instances running on EC2, using an auto-scaling group to spin up new instances as needed. I needed to send reminder emails to a subset of the team management services’ users every ‘x’ amount of days. The solution that best suited my needs in this situation was a leader-elected task.
 In the past, I’ve used ZooKeeper to schedule a leader-elected task. Gilt had helper classes, which made this a breeze. But I didn’t want to set up a ZooKeeper cluster in AWS just for a small, non-critical service, so I needed something simple and lightweight. A fairly standard setup for engineers who design distributed services is to have multiple instances of a service in an AWS auto-scaling group, so I decided to create my own leader election library and open-source whatever I ended up building. Introducing aws-leader-election: a Scala and akka-cluster based PnP leader election library for use in AWS.
aws-leader-election is built on Akka and uses akka-cluster’s cluster singleton to perform leader-elected tasks. It also uses AWS’s auto-scaling Java client to discover EC2 instances and creates an Akka cluster from the auto-scaling group members. 
Creating aws-leader-election
The first challenge in creating this project involved instance/node discovery. Using an autoscaling group made this relatively easy. The AWS Java SDK client gave me access to ask the auto-scaling group for its list of currently running instances. At this point I found some terrific work by Chris Loy, who set up an Akka cluster in EC2 using an auto-scaling group. This gave me a great starting point. I was able to ask my auto-scaling group for its list of currently running instances and use them as seed nodes for an Akka cluster. 
This is where I ran into my first issue. My Play service is built using the sbt-native-packager plugin and Gilt Senior Software Engineer Gary Coady’s Docker addition to native-packager (which allows you to build a Docker image and release it to the Docker repository). I then use an in-house script called ionblaster to automate a new AWS stack creation and deploy my Docker image in each EC2 instance. My issue was with Docker’s internal network stack vs. the host’s network stack, and the IP address Akka was binding to. To solve this, I had to force Docker to use the host EC2 instance’s network stack by providing the `–net=host` parameter to Docker. This would be an issue if we wanted to run multiple Docker containers on a single EC2 instance.
With this solved, I was free to move onto having my instances arrive at a consensus regarding which one is the leader. For this I took a look at the Raft algorithm for consensus. There were already libraries out there that performed Raft on top of an Akka cluster. I eventually decided that Raft was overkill just to perform the same level of leader election that Akka already provides. The Akka cluster singleton actor served my purposes more than adequately. By taking this approach, I had to accept that certain problems might arise; the potential drawbacks are documented in the Akka documentation quite explicitly. For my specific case, these potential drawbacks were all acceptable. I included some of the ZooKeeper leader-elected job helper classes to make things even simpler. I also wrote a few multi-jvm unit tests, which are serving my purpose perfectly; hopefully they will be useful for you, too.
A question you might ask
If there are so few guarantees in this implementation, then wouldn’t it be easier to simply create an AutoScalingGroup of exactly one node, with a health check, so that it bounces it if something gets stuck?
That’s one way to do it. But this approach wouldn’t have allowed me to play with akka-cluster :P. And would have meant a more hands-on approach than, “I want three instances of this service, make it happen,” which I’d much prefer.
akka-cluster handles nodes going down/leaving and coming back up/joining. And it’s a lot quicker then a bouncing instance, meaning that there’s less time in the no-leader zone.
Next Steps
While aws-leader-election fulfills its primary objective of a simple and lightweight leader election library for scheduling tasks, any contributions are more than welcome. Reach out to me via my GitHub page if you’d like to 

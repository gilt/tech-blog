---
layout: post
title: Designing Distributed Systems With ZooKeeper
date: '2013-08-13T16:15:00-04:00'
tags:
- zookeeper
- ordasity
- distributedcomputing
- apache
- open source
- Eric Bowman
- leader election
- partitioning
- znodes
- boundary
- database sharding
tumblr_url: http://tech.gilt.com/post/58175174761/distributed-systems-zookeeper
---
Let’s face it–designing distributed systems can be tough. There’s just no one-size-fits-all tool for creating distributed services: Every distributed application has a unique set of tolerances with regard to reliability, scalability, response time, and other performance factors. At Gilt, our toolbox for supporting distributed service development includes Apache ZooKeeper, RabbitMQ, Kafka and a smattering of distributed data stores. We made these technology choices based on years of hands-on development at Gilt, decades of cumulative experience across our engineering team and (literally) endless internal debate. 
By no means are Gilt engineers restricted to using the tools listed above, but most of us stick to using them because together they provide a solid foundation upon which to build a variety of solutions. ZooKeeper in particular has proven to be a fantastic tool for synchronizing distributed systems. For synchronizing data across nodes, it provides a set of APIs with simple and understandable behaviors, which leaves less room for misinterpretation. It also allows engineers to avoid getting bogged down by the common bugs and race conditions inherent to distributed synchronization. If you’re not familiar with ZooKeeper, you should check it out.
In our experience, we’ve found that the most common synchronization tasks boil down to either agreement between nodes, or serializing work. To address these use cases, we use two tools built on top of ZooKeeper: Leader Election and Partitioning.
Leader Election
It’s almost as if ZooKeeper had been designed with Leader Election in mind. In fact, its Recipes Page outlines common Leader Election logic. The common use case is choosing a master node among a set of peers to be responsible for certain decisions. Most implementations will also promptly elect a new leader when necessary. At Gilt, we use a straightforward flavor of Leader Election written by Eric Bowman, our VP Architecture. (Unfortunately, we have not open sourced it at this time, but you shouldn’t have much difficulty designing your own flavor of Leader Election based on the ZooKeeper recipe.)
To understand how ZooKeeper helps turn a complex task like Leader Election into a relatively trivial exercise, a brief explanation is needed. It’s easiest to imagine ZooKeeper as providing a remote filesystem. You can add and remove “znodes” (akin to files), query znode contents, or watch znodes. A znode can be created ephemerally, such that when the node that created it disconnects, the znode is removed. Clients can also “watch” znodes and receive notifications when znodes are removed. When these two features are combined, you have the beginnings of a powerful distributed synchronization system.
If Leader Election sounds like the solution to your problem, check out Apache Curator. It’s a fairly new project with reference implementations for many common ZooKeeper tasks.
Partitioning with Ordasity
Partitioning is a bit more complicated than Leader Election. Luckily, the folks at Boundary have created Ordasity, a fantastic solution built on ZooKeeper.
The idea behind partitioning is that some universe of work needs to be done, and you want to fairly assign that work to the available nodes. One type of “work” can be a set of incoming requests, such that each request will be serviced by one of the nodes. “Hmm…” you say. “Why is this better than using a basic load balancer?” Answer: It can be a lot smarter!
Posit that each request may represent an unpredictable quantity of work. Using Ordasity, you can track how much actual work is assigned to each node and intelligently assign incoming work to the least busy node. In essence, Ordasity enables load balancing based on computational complexity, not requests.
But Wait! There’s More…
An even more interesting use for partitioning with Ordasity involves segmenting a universe of known work. This is conceptually similar to database sharding. The nodes use Ordasity to divide the universe of known work among themselves. Each time a node is added or removed, Ordasity rebalances the work, ensuring that the universe is fully and discretely assigned.
Partitioning with Ordasity has simplified some of our systems by allowing us to impose the requirement that each unit of work is to be handled by, at most, one node at a time. Without this guarantee, we’d need an additional database for synchronization.
Below is a simplified example of how to use Ordasity to divide up work:
import com.twitter.common.zookeeper.ZooKeeperClient
import com.boundary.ordasity.{Cluster, ClusterConfig, SmartListener}
import java.util.concurrent.{ScheduledThreadPoolExecutor, TimeUnit, ScheduledFuture}
import java.util.{HashMap, TimerTask}

val pool = new ScheduledThreadPoolExecutor(1)

val nodeId = java.util.UUID.randomUUID().toString

val config = new ClusterConfig().setHosts("zookeeper.gilt.com:2181").
  setNodeId(nodeId)

val listener = new ClusterListener {
  def onJoin(client: ZooKeeperClient) = {
    println("Connected to ZooKeeper as %s".format(nodeId))
  }
  
  def onLeave() = {
    println("Disconnected to ZooKeeper")
  }

  def startWork(workUnit: String) = {
    val task = new TimerTask {
      def run() = println("Workin'' on %s".format(workUnit))
    }
    
    val future = pool.scheduleAtFixedRate(task, 0, 1, TimeUnit.SECONDS)
	
    futures.put(workUnit, future)
  }

  def shutdownWork(workUnit: String) {
    futures.get(workUnit).cancel(true)
    println("Stopped working on %s".format(workUnit))
  }
}

val clustar = new Cluster("example_service", listener, config)

clustar.join()
Want To Know More?
ZooKeeper and the tools built on top of it form an important piece of Gilt’s distributed computing architecture. In a future post, I’ll describe some of the other distributed technologies and methodologies that we use. In the meantime, if you have questions or suggestions for a future topic – or just want to keep up with the most interesting engineer in NYC – find me on Twitter: @adkap.

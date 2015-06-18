---
layout: post
title: Monitoring Network Traffic and Service Chatter with Boundary
date: '2013-05-14T12:32:00-04:00'
tags:
- jvm
- monitoring
- network
- metrics
- boundary
- gilt
- gilttech
- ordasity
- case studies
- Jetty
- RabbitMQ
- Apache ZooKeeper
- Coda Hale
- AsyncHTTPClient
- RequestFilter
- java.lang.Instrument
- Cliff Moon
- PostgreSQL
tumblr_url: http://tech.gilt.com/post/50426747760/monitoring-network-traffic-and-service-chatter
---
We recently published a case study with Boundary regarding how we, at Gilt Groupe, are using their product and I wanted to give some additional details concerning our decision process, what we were looking for, what we looked at and why we decided that going to Boundary was the best choice for us moving forward.
Gilt Groupe’s architecture is now very much a case of micro-service architecture. We have hundreds of JVM-based HTTP services interacting with each others or with backend systems such as PostgreSQL, MongoDB, RabbitMQ, Kafka, Zookeeper, and many more third-party solutions over various data interchange formats and protocols.
A few months ago, we felt we needed to get more insight into the detailed amount of traffic that was going in and out of every service or backend system. When various teams are working on new features that require more communication patterns and data exchange, it starts to be difficult to do capacity planning when you don’t know where you are.
Moreover, in our experience, we have seen that most features generally go from a normal usage pattern for months to a sudden very large adoption by our business operations. The amount of data can suddenly grow 1 to 2 orders of magnitude, which does not generally go without its own set of challenges.
To get better insight into the amount of data exchanged, we started the effort to monitor the data transferred out of our HTTP services (we use Jetty) using the excellent Metrics library from Coda Hale. This can be trivially done extending the existing Metrics InstrumentedHandler for Jetty:

public class CustomInstrumentedHandler extends InstrumentedHandler { 

  private final Meter bytesTransferred = Metrics.newMeter(handler.getClass(), "bytes-transferred", "responses", TimeUnit.SECONDS);
  
  private final Histogram bytesResponse = Metrics.newHistogram(handler.getClass(), "bytes-responses"); 
  
  // constructor omitted for blog readability
  @Override
  public void handle(String target, Request request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) throws IOException, ServletException {
    final AsyncContinuation continuation = request.getAsyncContinuation();
    try {
      super.handle(target, request, httpRequest, httpResponse);
    } finally {
      if (continuation.isInitial()) {
        long count = request.getResponse().getContentCount();
        bytesResponse.update(count);
        bytesTransferred.mark(count);
      }
    }
  }
}
The clients effort would be a bit more challenging however. In our JVM-based services we end using a menagerie of HTTP clients: AsyncHTTPClient with Netty 3.x provider, Apache HttpComponents 4.x, Apache Commons HTTPClient 3.x, and the venerable JDK HttpURLConnection.
This is the reality of having to deal with various third-party integration, it makes things more complicated than we would like to, but it can be a bit annoying to rewrite or extend some existing SDKs to try to use one and only one HTTP client across the platform (especially when non-extensible, or worse, closed-source).
The immediate problem faced is effectively how to instrument *all* those clients.
AsyncHTTPClient can be done easily using a RequestFilter and an AsyncHandler. The code would be something similar to the snippet below. There is not much overhead of doing it as you just need to count chunk size as they the HttpResponseBodyPart objects are received.
 public class InstrumentedAsyncHttpClientRequestFilter implements RequestFilter { 
  private final Meter bytesTransferred;
  private final Histogram bytesResponses;
  // ... initialization omitted for readability
  public FilterContext filter(FilterContext ctx) throws FilterException { 
    return new FilterContext.FilterContextBuilder(ctx) .asyncHandler(new MetricsAsyncHandler(ctx.getRequest(), ctx.getAsyncHandler())) .build(); 
  } 

 public class MetricsAsyncHandler implements AsyncHandler {
  private AsyncHandler delegate;
  private long totalBytesTransferred = 0;
  // ... initialization omitted for readability
  public STATE onBodyPartReceived(HttpResponseBodyPart bodyPart) throws Exception {
    long bytes = bodyPart.getBodyPartBytes().length;
    totalBytesTransferred += bytes;
    metrics.bytesTransferred.mark(bytes);
    return delegate.onBodyPartReceived(bodyPart);
  }

  public T onCompleted() throws Exception {
    T o = delegate.onCompleted();
    metrics.bytesResponses.update(totalBytesTransferred);
    return o;
  }
 }
}
Note that we tend to give a name to each service client which would map to a Metrics scope, which makes it useful to distinguish metrics between each client (some services use a dozen of clients).
For all the others clients, it is a bit more intrusive to be practical. And it doesn’t address how to monitor the traffic in/out going directly through the Socket api like for Zookeeper, Play Framework (Netty server), MongoDB and JDBC drivers, etc…
Another solution would be to write a JVM Java Agent via the java.lang.Instrument API to instrument some well known libraries (NewRelic uses a similar technique, but doesn’t track traffic). While it may looked like the less intrusive solution, it is also a fairly significant undertaking to develop instrumentations for several third-party libraries which you have to maintain over time.
Also, knowing we were looking with an interested eye to add systems such as Riak, Redis and possibly some various asynchronous drivers and having to deal with multiple versions of Scala… this was a cool project to work on technically, but maybe not excessively practical.
What we needed was something similar to nethogs minus the text interface. A tool capable of grouping the bandwidth by process, but ideally it would have some features also found in Wireshark.
We did not find anything matching those requirements.
Until a week or two later. We had Cliff Moon, Co-Founder and CTO of Boundary, visiting our New-York office to present Boundary and do a Tech Talk on Distributed Systems (which we blogged about).
We installed Boundary on some our servers to get a better idea. This was truly a revelation. The installation was painless with just a single command and as soon as the agent was up, it started to report data to the dashboard within the next second.


Each of the line represent the traffic volume happening on a given port/protocol across all nodes at a 1 second resolution. Traffic can easily be broken down. For example you have the ability to group servers, either manually or dynamically using pattern matching which makes it easy to segment your front-end from your backend machines and see traffic flowing between those groups (this is where a descriptive naming policy for your machines comes handy).
You can further segment your traffic by port / protocol. For example TCP 5432 would be the traffic to/from PostgreSQL. You can then easily analyze the traffic that is going from your backend machines (or a subset of those) to your PostgreSQL. Same thing could be done to know the chatter around our messaging infrastructure on RabbitMQ.
A lot more details on how all of this can be done is visible on a Youtube video ’Isolate your traffic with filters and conversations’.
There is a shortcoming currently for us where we are effectively losing a bit of visibility in our conversations. For instance, traffic to our services is always going through a set of dedicated service load balancers. For example we reach to it via a canonical url such as http://svc-product and the load balancer will balance between node1:7501, node2:7501, node3:7501. It means traffic from the caller to/from the load balancer happens on port 80 while the traffic to/from the load balancer to the callee is on port 7501.
caller ← port 80 → svc-lb ← port 7501 → callee 

Which means that the traffic flowing on port 80 is basically the aggregate of all service traffic and that we cannot see the traffic directly from caller to callee, but only the aggregate from caller to svc-lb and from svc-lb to callee.
This is something that may be alleviated a bit in the future as we are thinking about removing the load balancer and having applications doing the load balancing themselves using information from Zookeeper.
Boundary settings on the dashboard can be driven entirely from their REST API, which provides the added convenience of being able to integrate with your own configuration management system such as Puppet or Chef and a set of backend applications which may contain metadata about your environment.
The REST API is useful to define application aliases which gives names to a protocol:port (eg: ‘svc-product’ for TCP 7501), send deployment events or integrate with other systems (it can subscribe to NewRelic events via RSS).
We have only scratched the surface of Boundary so far and we are very excited about the direction it is taking and what is being developed. It has already proved extremely useful in identifying traffic volume and patterns occurring between services and databases. Something that would have required a lot more tedious investigative work can basically be done now in a few minutes and with much more flexibility than we could initially imagine and with no direct investment.
I hope that this (long) blog post will be helpful to some people who are facing the same challenges of not having enough visibility in their network traffic. If however you know of any interesting tool in that space, feel free to drop a note.
On a slightly unrelated note, we are also users of a nice library from Boundary called Ordasity. It is a great way to distribute workload across nodes via Zookeeper. It was brought to our attention during Scott Andreas’s tech talk at Gilt Groupe (another one !), and it might be the topic of another blog post.
– stephane

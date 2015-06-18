---
layout: post
title: 'Meet a Gilt Technologist: Roland Tritsch, VP Infrastructure Engineering'
date: '2013-08-09T11:45:00-04:00'
tags:
- technologists
- infrastructure engineering
- dublin
- roland tritsch
- gilltech
- interviews
- continuous deployment
- CRUD
- rich hickey
tumblr_url: http://tech.gilt.com/post/57797964302/meet-a-gilt-technologist-roland-tritsch-vp
---

Roland Tritsch is Gilt’s VP Infrastructure Engineering. Infrastructure Engineering works to ensure 100% uptime, while allowing Gilt to iterate and innovate as fast as possible. Roland has more than 20 years of industry experience in various technical leadership roles and is probably the oldest member of Tech who writes Scala code (nickname: Papa Roland). If he is not behind the keyboard, he’s riding his folding race bike (other nickname: Bumblebee) through the Wicklow Mountains of Dublin, Ireland.
How long have you been at Gilt?
For two-and-a-half years–since April 2011.
And how long have you lived in Ireland?
For eight years. I’m not Irish, though–I’m German.
Which is why your name isn’t “Roland O’Tritsch”–
It’s actually Roland McTritsch, with an M-C. Not Roland MacTritsch…
Thanks for the clarification! So, when did you decide that Gilt was the place for you?
At some point during the interviewing process–I felt there was a lot of passion for good software engineering here. It was the experimentation, the appreciation for excellence, and the willingness to not be afraid to question conventional wisdom. “Let’s do it this way”–well, why? If you cannot come up with a good answer, maybe there’s a different and better way.
What makes Gilt unique from other companies where you’ve worked?
For me, Gilt is the biggest experiment in next-generation software engineering practices that I’ve ever seen. That means, for instance, that in the last two years (I would say) half of my experience about how to do software engineering, and how to run a software engineering organization, has been questioned. And I like that.
Just in terms of software engineering practices, for instance, I like what we do in terms of decentralizing decision-making and empowering individuals. A lot of companies have tried it. There’s a risk when you do things as we do them, because people make mistakes. You have to compartmentalize the impact if something goes wrong. And we are well on the way to figuring out how to make this happen.
It seems that, to decentralize decision-making successfully, a certain level of maturity is required of the organization and the people in it.
It is a question of maturity, but also a question of process, approach, culture, and philosophy, because you just have to have experience and awareness of what decentralization means. What it comes back to, and what I like, is that we want to make engineers feel safe and secure, so that they get aggressive with the experimentation and the innovation.
An example: when I started here, we had one gigantic EC2 account. For that account we had centralized management with a couple of people being responsible for it. People were afraid to do anything with the account and always asked for help to get something done. It was out of concern that, if something went wrong, it would affect a lot of people. We now have a system in which people who have access to EC2 get their own account and can do whatever they like with it. And that has created a very good situation where people feel safe and secure, because if they make a mistake it’s only affecting them and no one else.
You have a tagline: “All Operations & Zero Waiting.” What does that mean?
The main promise of “All Operations & Zero Waiting” is that, in the next six to twelve months, we will have created a situation in which every Gilt engineer can actually do operations, write a service and experiment, test something, prove something, or whatever else they need to do to get their jobs done, and there will be zero waiting. If you want, you’ll be able to sit down one evening, write the service, deploy it into production, and, two days later, have data that will either prove or disprove your idea. That would be awesome, and you won’t need to ask anyone or wait for anything.
When did you come up with this tagline?
I invented it around the time I took the job here–it came from the industry concept of “no operations.” Basically, some people claim that they can run an ecommerce business with no operations–they can be engineering-only. From my point of view, this creates the totally wrong impression that you don’t need operations. I think what “no operations” people actually want to express is that everybody can do operations–therefore, “all operations.” You want to demystify operations and take away the fear.
How do you take away that fear?
It comes back to the question of compartmentalizing. A lot of people don’t like to touch our production environment because if they do it wrong, they’ll bring the site down. The interesting idea we started developing about a year ago is that software systems are brittle for exactly the same reason: mutability. Changes happen, and changes in a software system can have unintended side effects. When you think of functional programming, one of the big values it offers is immutability.
We are going to apply the concept of immutability to configuration management and deployment management, which means that after you have deployed a service on a container it will never change again. If you want deploy a new service you will spin up a new container and deploy the new version of the service onto that container and shut down the old one. Instead of CRUD, we are doing CRD (no U).
How does compartmentalization of our platform work?
For us, always going forward with freshly configured containers is a much more robust and stable concept. Also, in our system you can undo easily, and within one minute, you can roll back to the previous version and undo your mistake. We’ve created this system through a combination of Galactica (a family of services that allocates containers via CloudStack, allows for provisioning of other services, and implements a meta-data model) and Ion-Cannon, a project we’re running as a continuous deployment platform.
Why did we create our own continuous deployment platform instead of using Bamboo or some other existing platform?
Other platforms don’t give us the flexibility we want and need in our continuous deployment, or allow for integration with Scala. Ion-Cannon brings our built-in environment, SBT, and Jenkins environment together, and is Scala-based.
How did this approach originate?
About year ago, we saw an inspiring talk by [Clojure creator] Rich Hickey on the value of immutability. Then we had an infrastructure summit in Dublin, and during that summit we came up with the idea to apply the concept of immutability to configuration management and deployment management. That means that, going forward, if something is in production, we’ll never change anything. You’ll put a service into production with a given version, and we’ll start our container just for that one service. We configure it, deploy the service, start it, run it, and never update it again. If you need a service change, or another type of change, you’ll need to bring up a new container, deploy a new version of the service, and then can either kill the old one or run it in parallel.
This keeps things constantly rolling forward, and eliminates CRUD. We only create and delete, we never update. So whatever is deployed in production is immutable. And that takes away a whole slew of problems, in terms of how to test, manage or configure something.
How is our way different from the method other companies follow?
The way many companies run is that, in production, they have an auto-configuration thingie that constantly changes the state of their system. There are software solutions to do this (Puppet, Chef), but it makes it very hard to make predictions about the state of your system. It’s also very hard to test. Roll-outs can fail on machines that aren’t configured the same way as on the test machines.
What are your goals for the next six months?
What I mainly want to do is roll out Galactica to the engineering organization. That means that our engineers will be able to put services into production without any intervention from the outside. They’ll be able to touch the website directly, but the automation process will ensure that they can only roll out their changes to a subset of our member base. And if something goes wrong, the impact will be limited. I want to create this feeling of safety, that to try and fail is okay.
How do you make this happen? What is your management philosophy?
I believe in the power of “why”! I ask myself a lot why I am doing what I am doing, and why does it matter to Gilt. And I ask the people around me why what they do matters. Sometimes they know–and if they don’t, then I am always available to do soul-searching. Most of the time it is not very hard to connect what we do with what Gilt needs. In my case, what we do matters because it allows us to innovate, iterate and experiment faster, while maintaining a 100% uptime record. This is incredibly valuable for Gilt and, by extension, for our members. Indirectly, Infrastructure Engineering makes members happy, right?
One last question: What are your thoughts on change?
Change is good, but if you go about change the wrong way then you’re going to hurt yourself. It’s important to learn how to deal with the risk that comes with change rather than avoid the problem in the first place.
Also: I don’t think you will always get it right the first time, or that whatever you come up with will be right forever.
One of my favorite quotes is from Samuel Beckett: “Ever tried. Ever failed. No matter. Try Again. Fail again. Fail better.”

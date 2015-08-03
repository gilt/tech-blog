---
layout: post
title: Private NPM Modules: A Song of Fire and Ice
author: Andrew Powell
date: '2015-08-03'
categories: 'tech npm'
tags:
- npm
- private modules
- tools
- rake
- gulp
---

Grab a coffee or pop and a snack, this is a read.

Several years ago, Gilt Tech decided to adopt a new strategy for developing the overall Gilt platform. It was determined that many small applications should comprise Gilt.com, rather than one (or few) large monolithic applications. We called this strategy 'Lots of Small Applications,' or 'LOSA.' Key to LOSA were decentralized, distributed front-end assets. Enter [NPM](https://www.npmjs.com/about).

Our requirements for how this was to work was varied, and we authored build tools to facilitate them. Our build tools solved many problems that at the time, didn't have solutions. We also knew we couldn't rely on external services to host our modules, because we need to know that the registry these little guys were stored in needed to *always* be available. NPM was still new, and npmjs.org was still a baby back then. Third-party SaaS providers weren't a thing for this yet. And so we spun up our own NPM registry in-house. This worked for years, and worked well - until one day it became obvious that we were hopelessly out of date.

June 2014: A framework for developing NodeJS applications at Gilt took shape, and the need to start installing public modules from npmjs.org became real. The architects of the in-house registry had long-since parted ways with Gilt, and we scrambled to try and update an aged system. We attempted to implement a proxy from our private registry to the public. Things worked, but not well, and it was decided that we'd look to a third-party for our registry needs. We eventually settled on a well-known company in the NodeJS space.  We were able to migrate our internal registry to their service, and everything worked very, very well.

In February of this year we were informed that a very large entity, we'll call them "MovableUncle," had purchased the registry-hosting company and they would cease their registry business. We knew we'd have to move off of the platform and began carefully and cautiously considering alternatives. We were told that we'd have until December 2015 - and then someone rolled in the dumpster and lit that baby afire. The registry company experienced massive attrition, including all of their support staff, resulting in a near-complete inability to get support. Our data was locked there, and despite exhausting many channels of communication, we were unable to procure a backup archive of our data. Some amount of panic set in when their website was updated to show August 2015 as the cutoff date.

Without knowing for sure just when the service would go down, [we knew it was time to act](https://www.youtube.com/watch?v=NU0PijNCEwo), and quickly. We identified the three most viable options for moving forward: Hosting in-house again, going with another private registry SaaS provider that Gilt was already using for a different service, or going with the newly announced [Private Modules offering](https://www.npmjs.com/private-modules) on npmjs.org.

After much discussion and weighing the options against one-another, we decided to bite the bullet and go with npmjs.org. That bullet we had to bite meant a lot of changes internally. Their [scoping mechanism](https://docs.npmjs.com/getting-started/scoped-packages) while elegant for installing modules and organization, was an enormous pain point for Gilt - it meant we had to update the names and dependencies for 220 modules. We'd also be losing our history of published modules covering nearly four years. Representatives for npmjs.org explicitly told us there was no way to import a registry, even if we could get a backup out of the dumpster fire. That also meant that we'd have to *republish 220 modules*.

**['Aint Got Time To Bleed](https://www.youtube.com/watch?v=w6Qhc-8cxMU)**, as August was fast-approaching. This process required either a metric poop-ton of man-hours, or some quasi-clever scripts. We put together two NodeJS scripts;

1. `npm-registry-backup` would pull down a manual backup of our registry. That would mean iterating over all of our modules in the repo, fetching the `npm info` for each, and downloading the tarball for each revision.
2. `npm-scope` would iterate through a target directory looking for package.json files, update the name by adding our npmjs.org scope, adding the scope to any private modules in the dependencies property, and then finally publishing the module to npmjs.org. This script also allowed us to automagically update our apps that had private module dependencies.

We'll make those scripts publicly available in the coming week(s) once we're out of the forest. From start to finish the process took about 9 man-hours (3 hours / 3 fellas) for backup and update of 220 modules, distributed through 14 different git repositories. Getting everything just right across the org was another matter altogether. Switching module paradigms isn't a trivial thing when the org has relied on one model for a few years.

[Knowing Is Half The Battle](https://www.youtube.com/watch?v=pele5vptVgc) and to say we learned a lot from this ordeal would be an understatement the size of Texas.

## Build Tools

One of my favorite Gilt-isms is *"It solved the problem at the time."* Our primary build tool (named `ui-build`) for front-end assets was written a few years ago when we still thought Rake was all the hotness. It's a brilliant piece of code and study in Ruby polymorphism - unfortunately it's infested with massively complex regular expressions, hardcoded assumptions about filesystem locations, and chock-full of *black magic*. *"Black magic"* is the term we use at Gilt for all of the things in `ui-build` that were written by people no longer with the company, for which we don't know it's doing. Once we updated `ui-build` to handle scoped modules, we learned that we had to *republish* around 80 modules, due to black magic. We require publishing of modules to go through the build tool so that things like linting and verification of certain data and standards are performed prior to actually publishing to npm. We learned that in that process, things like automatic compilation of LESS and manipulation of vendor code, are done *SILENTLY*.

While our next-generation, gulp-based build tool is being polished and rolled-out, we've used this lesson to ensure that we don't have gaps in knowledge and documentation like we experienced with `ui-build`. We're also using this opportunity to explore how we can use the standard processes of npm to perform `pre-publish` or `post-install` steps and remove the need for black magic.

## Maintenance, Maintenance, Maintenance

Some of our apps are so out-of-date they might as well be wearing bell-bottoms and driving [Gremlins](https://jimburgan71.files.wordpress.com/2008/04/76gremlin.jpg). So so so many apps had dependencies on module versions that were a year+ old. Remember - we lost that revision history in the registry when we moved to npmjs.org. Things blew up in epic fashion when attempting builds of many of our less-frequently-maintained apps. Some of the dependencies were so stubborn that we had to republish the tarballs for old versions that we had pulled down from `npm-registry-backup`. 

We need to be better at updating our apps. It doesn't always make cost-benefit sense to management, but it helps eliminate technical debt that we paid for in man-hours during this process. On top of the the original 9 man-hours, we had to spend roughly an additional 32 man-hours (8 hours / 4 fellas) with subsequent clean-up. There is progress on this front, however; Gilt Tech recently embarked on an ownership campaign internally called the 'Genome Project' which should help address this concern.

## Conclusion, or Potty Break

Overall the move was a success. We're still chasing the occasional edge case and build problem, but the major hurdles have been overcome. The improvement in speed and reliability of NPM over the SaaS registry host has been marked. We're able to use the latest features of the NPM registry and have regained the ability to unpublish; something we lost with the SaaS host. The technical improvements coupled with the knowledge we've gained have made the endeavor worthwhile. And unless "MovableUncle" inexplicably acquires npmsj.org, we've set the company up for stability in this area for some time to come.


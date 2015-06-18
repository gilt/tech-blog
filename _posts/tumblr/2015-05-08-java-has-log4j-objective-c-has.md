---
layout: post
title: Java has log4j...Objective-C has CocoaLumberjack...and now Swift has CleanroomLogger
date: '2015-05-08T17:44:05-04:00'
tags:
- swiftlang
- swift
- ios
- xcode
- log4j
- cocoalumberjack
- opensource
- github
- gilt
- gilttech
- mobile
- giltmobile
- apple
- iphone
- ipad
- programming
- development
- open-source
tumblr_url: http://tech.gilt.com/post/118471923164/java-has-log4j-objective-c-has
---
Gilt Tech is proud to announce the release of CleanroomLogger 1.0, an open-source logging API for iOS.

CleanroomLogger provides a simple, lightweight and performant logging API written in Swift that will be readily understood by anyone familiar with other logging packages like CocoaLumberjack and log4j.

CleanroomLogger Highlights

CleanroomLogger provides these key features:

Classify log messages according to one of five severity levels: verbose, debug, info, warning and error
See the source file and line number of each log message recorded
Silently ignore messages below a given severity threshold
Far more respectful of the calling thread than NSLog()
A trace() function that can be used to trace an application’s code paths by logging the location of its caller
Configurable log behavior that puts the application developer in control of embedded code
Extension points that allow custom implementations for (1) log message formatting, (2) message filtering logic, and (3) the recording of log messages to an underlying facility.
Message logging

Each message sent to the log is associated with a severity value indicating the relative importance of the message.

You would send an informational message as follows:


Log.info?.message("The user has added \(count) items to the cart")


If a condition occurs that itself isn’t an error, but that might signal future trouble, you might issue a warning:


Log.warning?.message("We''re running low on space!!!")


Finally, when things hit the fan, you’ve got:


Log.error?.message("Oh my, this is extremely embarrassing")


Each log message is recorded with the file and line that issued it, so you can very quickly figure out what code was responsible for a given message.

Execution tracing

As you’re developing and testing your code, you might want to understand the flow of execution your code takes. You can add trace() calls to various points in your code:


Log.debug?.trace()


The code above would print out the file and line number containing the trace() call, as well as the name of the calling function. The output looks like:


ModularTable.swift:364 — tableView(_:cellForRowAtIndexPath:)


Logging arbitrary values

Sometimes life hands you an NSError. Why bother constructing a new message? The NSError is the message:


Log.error?.value(err)


This function accepts Any?, meaning it’ll handle anything you throw at it.

Extensibility

CleanroomLogger’s extension points allow you to fully customize all aspects of logging without having to worry about the mechanics of how a logging engine is implemented.

The ability to provide one or more custom LogRecorder implementations is particularly powerful. You could implement your own LogRecorder to do things like:

Write messages to a file or set of (potentially rotating) files
Store messages with a warning or error severity in a database for subsequent diagnostic evaluation
Send messages with an error severity to a network endpoint to enable rapid response to codebase instability
And because more than one LogRecorder can be used at a time, you can multiplex your log messages to multiple destinations without writing any additional code.

About CleanroomLogger

CleanroomLogger is part of the Cleanroom project a set of open-source Swift projects launched as “an experiment in re-imagining Gilt’s iOS codebase in a legacy-free incarnation that embraces the latest Apple technology.”

The source code for CleanroomLogger is available on GitHub, and may be used, modified and redistributed freely under the MIT license. 

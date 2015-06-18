---
layout: post
title: Modularity and the iOS Status Bar Network Indicator
date: '2014-08-25T12:04:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Gilt Mobile
- Mockingbird
- open source
- Mockingbird Toolbox
- iOS
- Evan Maloney
- Evan Coyne Maloney
- Webbys
- modularity
- iPad
- MBServiceManager
- UIApplication
- networkActivityIndicatorVisible
- API
- APIs
- thread safety
- MBSingleton
- iOS Status Bar Network Indicator
tumblr_url: http://tech.gilt.com/post/95741287114/modularity-and-the-ios-status-bar-network
---


Gilt recently released Mockingbird Toolbox, an open-source project for iOS intended to make common development tasks easier. The Toolbox is the basic building block of Mockingbird library, which will be released in stages over the coming months. Mockingbird serves as the base layer of Gilt’s award-winning iPhone and iPad applications.
This post is the first in a series that will be highlighting the code available in Mockingbird Toolbox and explaining how you can use it in your iOS projects.
Modularity
Modularity in software design is a key strategy for managing complexity. A well-crafted code module is:
Focused — it tries to do one main thing; anything else it does is in support of that
Isolated — it reduces interconnections within code by providing a public API that minimizes the points of contact between modules
Well-behaved — it doesn’t change global state in a way that interferes with other modules
When separate modules need to interact with a shared resource, modularity becomes more difficult to attain.
In order to be well-behaved, modules need to use shared resources in a way that recognizes the fact that other modules may be using that resource, too.
One way to try to account for that might be to introduce a mechanism for modules to communicate with each other to ensure proper behavior with respect to the shared resource. But doing so would make the modules less focused and isolated.
Gilt’s mobile team faced these sorts of design decisions during the evolution of our iOS apps. One generic solution we built was  the MBServiceManager class, which we’ll discuss further in a future post.
But there was one specific shared resource that required its own solution: namely, the network indicator that appears in the status bar.
The Status Bar Network Indicator
The network indicator is the animated spinner that you sometimes see in the status bar, typically to the right of the other network information in the upper-left corner of the device screen.
The spinner doesn’t appear automatically; instead, applications are responsible for turning it on when they’re using the network, and turning it back off once they’re done. Displaying the network indicator is entirely optional, but polite applications are honest about when they’re consuming the user’s bandwidth.
Applications control the spinner through the UIApplication’s networkActivityIndicatorVisible property. Setting the value to YES causes the animated spinner to appear. Setting the property back to NO hides the spinner.
You might think that managing the network indicator is as simple as setting networkActivityIndicatorVisible to YES when an operation starts and back to NO when it finishes, but consider what happens when an app sends multiple network requests:
Network operation A starts
Network operation B starts
Network operation B completes
Network operation C starts
Network operation A completes
Network operation C completes
Under this scenario, the spinner should be animating from Step 1 through Step 6.
But that’s not what happens if we directly manipulate the networkActivityIndicatorVisible property at the start and end of each request. Instead, we get this behavior:
Spinner appears
Spinner animating
Spinner disappears
Spinner appears
Spinner disappears
Spinner remains hidden
Half the time, the network indicator is reflecting the wrong state.
Because the beginning and end of different network operations can be interleaved, the fact that there is only a single on/off value for the network indicator becomes problematic. If more than one set of code attempts to directly manipulate the value of networkActivityIndicatorVisible, we will get unexpected results.
Network Indicator Coordination
To avoid this problem, we decided upon creating a coordinator for the network indicator. The coordinator provides a simple interface for reporting when operations begin and end. Wherever network operations are performed, our code interacts with the coordinator, which in turn decides when to show and hide the spinner based on what’s happening across the entire application at any given moment.
The coordinator was designed to:
Maintain a count of in-progress network operations
Whenever an operation starts, the count would increment
Whenever one completes, the count would decrement


Set networkActivityIndicatorVisible property to YES whenever the count increases from 0 to 1


Set networkActivityIndicatorVisible property to NO whenever the count decreases from 1 to 0


Operate correctly in a multi-threaded environment

Introducing MBNetworkIndicator
The public interface to our coordinator is provided by the MBNetworkIndicator class, part of the Mockingbird Toolbox open-source project.
Any code that issues network requests can maintain one or more MBNetworkIndicator objects. Each instance is intended to represent one or more related network operations occurring on a single thread. While those operations are in progress, the MBNetworkIndicator instance is kept around, and is notified when operations begin and end.
The API consists of three instance methods:
operationStarted — Called whenever a network operation begins
operationFinished — Called whenever a network operation completes
cancelOperations — Called to signal that all in-progress operations associated with that specific instance should be considered finished (equivalent to calling operationFinished once for each in-progress operation)
Implementation
Every MBNetworkIndicator instance maintains a counter of network operations that is incremented for each call to its operationStarted method and decremented for each call to its operationFinished method.
Calls to those methods also update a master counter, which keeps a single, application-wide count of in-progress operations.
You can think of it this way:

The count maintained by any given MBNetworkIndicator instance is equal to (the number of times its operationStarted method was called) minus (the number of times its operationFinished method was called)


The master count is equal to (the number of times operationStarted was called on all MBNetworkIndicator instances) minus (the number of times operationFinished was called on all MBNetworkIndicator instances)

Whenever the master count of network operations is greater than zero, the status bar network indicator is displayed. Otherwise, when there are no operations, the indicator is hidden.
Canceling Operations
Let’s say you have a UINavigationController-based app, and any given UIViewController pushed onto the navigation stack could result in multiple network requests being issued. Further, you handle the user tapping the Back button by hooking into viewWillDisappear: to cancel any network operations that haven’t yet finished.
In such a case, you might opt to have each UIViewController maintain its own MBNetworkIndicator instance. You would call operationStarted and operationFinished as requests are processed normally. But within viewWillDisappear:, you would call cancelOperations to signal that all pending operations for that view controller have been cancelled.
Calling cancelOperations is equivalent to calling operationFinished once for each pending operation.
Maintaining References
To ensure that the master counter balances over time, MBNetworkIndicator assumes that when an instance is deallocated, it is a signal that there are no related network operations still pending. (This is achieved by a call to cancelOperations from within dealloc.)
Because of this, you are expected to maintain strong references to MBNetworkIndicator instances that are still tracking pending operations.
Thread Safety
Because individual network operations are bound to specific threads, MBNetworkIndicator instances are designed to be used only on a single thread; instances must not be shared across threads.
However, the underlying mechanism that maintains the master counter and manages showing and hiding the network activity indicator is thread-safe.
The mechanism uses functions declared in <libkern/OSAtomic.h> to ensure that the master counter is handled correctly when several MBNetworkIndicator instances are in simultaneous use on multiple threads.
What’s Next
Our MBNetworkIndicator class is just one way to manage a shared resource while adhering to the principles of modularity.
In subsequent posts, we’ll discuss:

The MBSingleton protocol and our super-easy way to make singletons


The MBServiceManager class and how we use it to manage shared runtime services that we don’t necessarily want running all the time

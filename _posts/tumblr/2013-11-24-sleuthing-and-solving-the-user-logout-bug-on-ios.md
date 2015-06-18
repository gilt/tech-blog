---
layout: post
title: Sleuthing--and Solving--the User Logout Bug on iOS 7
date: '2013-11-24T08:05:00-05:00'
tags:
- Evan Maloney
- ios7
- iOS 7
- iOS Development
- user logout bug
- background fetch
- Gilt app
- data
- customer experience
- user experience
- bugs
- Eureka moments
- Delta app
- The Verge
- Ellis Hamburger
- iOS Keychain
- infosec
- default security
- kSecAttrAccessible
- kSecAttrAccessibleAlways
- authentication
- UIApplicationDelegate
- 'applicationProtectedDataDidBecomeAvailable:'
- Gilt for iPhone 4.0.2
- Evan Coyne Maloney
tumblr_url: http://tech.gilt.com/post/67708037571/sleuthing-and-solving-the-user-logout-bug-on-ios
---

iOS 7 brought many new features, and much new work for developers.
One of the features the Gilt mobile team was most excited about was background fetch. With background fetch, apps that are running in the background—or not even running at all—can wake up periodically to issue server requests and download data. The purpose is to make the most up-to-date content visible the instant the user brings up an app. In an ideal world, background fetch would kill off the “Loading…” screen that server-driven apps typically present when launched.
Background fetch is particularly well-suited for us at Gilt, because we feature a new slate of sales every day. Each day brings updated sale data and new photos to send to the user.
Before iOS added support for background fetch, a user would launch the Gilt app (or bring it to the foreground after a certain period of time), and we’d start a flurry of communication with the server that would eventually result in the sales list and associated photos being loaded; the user’s cart and other settings would also get synced. On slow network connections, this process could take a while—costing our users precious time while they raced against other customers before the items in the day’s flash sales sold out.
An Unexpected Complication
We introduced background fetch in our Gilt for iPhone 4.0 release. Immediately the benefits became apparent: users could access sales much more quickly than before, and they also spent less time in loading-screen limbo. We patted ourselves on the back for a job well done.
And then we started to receive bug reports. Users who had logged in and left the “Stay Signed In” option turned on began to report trouble. A day or two (or three) after signing in, these users would suddenly be logged out. They’d sign in again, only to be booted out again within the next few days.
Weird.
Although we had not seen this issue during our QA testing, we eventually started noticing it on our personal devices. But we could never pin down exactly what we were doing to cause it.
As any developer will tell you, repeatable steps to reproduce—the actions a user needs to perform to hit a bug—are critical in diagnosing and fixing problems. After all, how can you be sure you’ve fixed a bug if you don’t know how to trigger it in the first place?
We didn’t have steps to reproduce, so we scoured our codebase and tried a number of speculative fixes. We created new test binaries and distributed them to our QA team and internal users. And then we waited a few days to see if everyone who signed in still was. Soon enough, we got the verdict: the bug remained alive.
So we’d repeat the cycle again.
A LaGuardia Eureka
In the middle of all this, I was about to depart on a long-planned vacation. While waiting to board a plane at LaGuardia, I fired up the Delta app to retrieve my boarding pass. Despite having just logged in a few minutes earlier, I noticed that I was being asked to log in again. I had used the Delta app under iOS 6, so I knew the normal behavior was to keep me logged in.
I logged in again, and as a test, put the app in the background. A few minutes later, I returned, and again I was logged out. I tried a few other apps, and noticed that Gilt and Delta weren’t the only apps bitten by the user logout bug.
Going on vacation gave me a reason to use the Delta app, which in turn provided the Eureka moment that pointed me in a different direction. Gilt’s mobile team had been working under the assumption that the user logout issue was specific to our app. But now the problem appeared to be widespread—a hunch confirmed by The Verge’s Ellis Hamburger—and this gave us a starting point for researching the problem.
When iOS 7 became available, the nuances of background fetch weren’t immediately obvious to developers. There was a temptation to approach this new feature with the attitude: Great! I’ll just take the network requests my app makes at launch, and put them in a background fetch wrapper. How easy is that?
Not that easy, it turns out. Because background fetch changes the environment in which an app’s networking code executes, the same code won’t necessarily behave the same way when running in the background.
The Source of Our Trouble
In the case of the user logout bug, the problem was that the iOS Keychain wasn’t consistently available when we’d try to access it.
The Keychain is the recommended place for storing sensitive information like usernames and passwords. When data is put in the Keychain, iOS ensures that it is stored securely. By default, when running on phones with a lock code, secure Keychain items remain encrypted while the lock screen is on; they only become available after the owner enters the correct code—or successfully scans a fingerprint—to unlock the device. This ensures that someone gaining physical access to your phone can’t perform a basic forensic analysis to extract sensitive data from your Keychain.
Before background fetch, most apps could assume that their secure Keychain items would be available whenever they were needed, because most apps didn’t expect to be performing routine operations—much less be running—when the lock screen was on. However, with background fetch, it is now possible for an app to wake up while the device is locked, when its Keychain items aren’t available.
The Gilt app periodically re-authenticates with the server and syncs the items in the user’s cart. This ensures a seamless cross-device experience for our users. However, it was also the source of our user logout bug, because our authentication requests would sometimes get issued in the background when the device was locked.
In such a case, the Gilt app would dutifully ask the Keychain for the user’s credentials. But because the device was locked, the Keychain would return a null value, causing the app to behave as though there were no user credentials at all. As far as the app is concerned, no credentials == no user, so the next time the user began interacting with the app, they’d no longer be logged in.
We never caught this problem in our internal QA testing, because we didn’t have lock codes on our test devices.
Don’t Decrease Default Security
After discovering that Keychain access was the source of the issue, we sought to find out how other developers approached solving it. One popular suggestion is to store items in the Keychain with the kSecAttrAccessible attribute set to kSecAttrAccessibleAlways. Unfortunately, this requires using a less secure mechanism for storing data than the Keychain would otherwise use by default.
If the only way for your app to function correctly during a background fetch depends on loosening security settings, you should seriously consider refactoring your code. The kSecAttrAccessibleAlways setting allows data to remain unencrypted while the device is locked. The stored data will not be secure if someone manages to gain physical access to your device. At Gilt, we need to be extremely careful about how we handle sensitive data. If we’re going to explicitly change a default security setting, we’re going to tighten that setting, not loosen it.
Instead of reducing the security of what we store in the Keychain, we changed our request model to ensure that authentication never needs to be done in the background. If the Keychain isn’t available, we simply won’t try to authenticate.
This solution addresses only half the problem, though. In an ideal world, we’d still be able to authenticate and sync the cart sometime before—or at least when—the app becomes active, to ensure that the user always sees the current cart items. If the device is locked, we need to be notified when the Keychain becomes available again, so we’ll know when it is safe to build the necessary server requests.
Knowing When the Keychain is Ready
The key is hooking into the UIApplicationDelegate’s applicationProtectedDataDidBecomeAvailable: method.
iOS calls this method after the device has become unlocked, so it serves as a signal that we can now get the user’s authentication credentials from the Keychain. This method can be called before the app is brought to the foreground, letting us get a head start with the cart sync.
Although rethinking our server requests for a background fetch world required a little more work, we avoided undermining iOS’s default security settings.
And since we rolled out this change in our recent Gilt for iPhone 4.0.2 release, we’ve received no more user reports about this problem.
The moral of the story?
When faced with a seemingly intractable problem, take a vacation. You might find inspiration in unexpected ways.

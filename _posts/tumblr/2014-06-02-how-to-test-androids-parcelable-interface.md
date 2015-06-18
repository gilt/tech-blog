---
layout: post
title: How to Test Android's Parcelable Interface
date: '2014-06-02T11:03:36-04:00'
tags:
- Gilt
- Gilt Tech
- gilttech
- Gilt Groupe
- Android
- mobile engineering
- Android development
- Kevin Schultz
- Intent
- Bundle
- Java
- Serializable
- Parcelable
- Parcelable objects
- equals() method
- Guava equals helpers
- James Wilson
tumblr_url: http://tech.gilt.com/post/87599117269/how-to-test-androids-parcelable-interface
---
Android applications invariably seem to have many places where you have to pack data into an Intent or Bundle in order to pass it on to another component. I have found that packing a single Java object in the payload is far more maintainable than using several primitive key/value pairs. If you decide to add or remove an a field to the object later, you won’t have to go back and modify every single Intent & Bundle. In order to do this, the object must implement either Serializable or Parcelable. I generally prefer Parcelable, even though it takes a bit more code to implement.
Unfortunately, I recently ran into a huge pitfall with Parcelable objects. To ensure that my Parcelable implementation is correct, I had been using a very basic unit test–but I didn’t realize that the test wasn’t actually proving everything was working as intended. One night back in February, I was refactoring some code and seeing ClassCastExceptions when pulling a particular Parcelable object out of a Bundle. I couldn’t figure out where the type was getting switched in my code, but it never occurred to me that the actual Parcelable implementation was at fault because I had too much faith in my unit tests. After a couple hours of digging, I figured out that the naive unit tests I had been using for Parcelable don’t actually ensure anything. Hopefully this post can help you avoid the same mistake.
First, a quick summary of implementing Parcelable if you have not done it before. In order to make an object Parcelable, you must handle writing to the Parcel, creating an object from the Parcel, and provide a CREATOR factory. This code is pretty straightforward, although there are a few gotchas. Take a look at the implementation below for class ‘Foo’. In order to test these types of classes, I always make sure to write (or generate) a proper equals() method.


In order to effectively unit test the parceling objects, you must implement a deep comparison equals() method. This ensures that all fields are tested. This is simple to autogenerate in any Java IDE, or you can use the Guava equals helpers for a cleaner implementation. 
(Bonus rant: why did the Android team not include writeBoolean() and readBoolean() methods? I generally pack booleans as an int, but you can also use a byte or a String to pass them. Thanks to this answer on StackOverflow for the inspiration on how to pass them cleanly.)
My original unit test naively mirrored how you actually use Parcelable objects. Stick it in a Bundle, pull it out of a Bundle, and check equality.

Thus, the above test passed even though the Foo class’s CREATOR was written originally as shown below. Note that CREATOR is returning type Bar instead of type Foo. This is one easy pitfall when writing the boilerplate associated with Parcelable.

After finding the actual bug, my concern switched to figuring out why the unit tests hadn’t caught it. It turns out that Bundle doesn’t actually serialize/de-serialize each value until the Bundle itself is parceled. Thankfully James Wilson has a nice solution that correctly tests the object.

In fact, with this code the test suite won’t even build because CREATOR’s return value is type checked at compile time, rather than casting from Bundle’s getParcelable() at runtime.
I would recommend writing that unit test anytime you are creating a Parcelable object.
Republished from Kevin’s blog.


---
layout: post
title: Optimistic Type-casting in Objective-C
date: '2011-05-04T16:00:00-04:00'
tags:
- Objective-C
- mobile development
- gilt mobile
- gilt
- gilttech
- evan coyne maloney
- type-casting
- optimization
- how-to
- protips
- submission
tumblr_url: http://tech.gilt.com/post/5196299135/optimistic-type-casting-in-objective-c
---
As developers, we often find ourselves dealing with some variant of this scenario: we’re iterating through a collection containing mixed object types, and we’re only interested in objects of a certain type.
For example, let’s say we’ve got an NSArray representing desks in a classroom. Each array element corresponds to a specific physical desk, which may or may not be assigned to a student at any given time. If a desk is assigned to a student, the array element will contain an NSString instance whose value is the name of the student assigned to that desk. If a desk is unoccupied, the array will contain a pointer to NSNull instead.
In Objective-C, the code for performing such a task usually looks something like:
//
// assume the variable ''desks'' points to a pre-existing NSArray
//
Class stringClass = [NSString class];
NSUInteger deskCount = desks.count;
for (NSUInteger i=0; i<deskCount; i++) {
	id obj = [desks objectAtIndex:i];
	if ([obj isKindOfClass:stringClass]) {
		NSString* studentName = (NSString*) obj;
	
		NSLog(@"%@ is assigned to desk %u (of %u)", studentName, (i+1), deskCount);
		
		// perform other operations with the student''s name
	}
}

Using a technique I call “optimistic type-casting,” we can make the code a little bit tidier.
Optimistic type-casting relies on the fact that in C-based languages (unlike, say, Java), it is possible to assign a typed pointer variable so that it points to a value of a completely different type. If that’s a little unclear, it means in Objective-C, we can do stuff like this:
NSString* myName = (NSString*) [NSNumber numberWithInt:-1];
Here, we’ve assigned myName, which is declared as a pointer to an NSString instance, so that it actually contains a pointer to an NSNumber instance.
Not only will the code above compile without warning, but as long as we only call methods on myName that are implemented by both NSNumber and NSString, the code will execute without crashing, and the compiler will remain silent. Calling [myName doubleValue] works just fine.
This allows us to take the sample code above and eliminate the line containing the studentName = (NSString*) obj cast. We optimistically assume that the object we’ve been handed is of the exact type we want.
So, when we retrieve the array value by calling [desks objectAtIndex:i], we immediately assign it to an NSString* variable instead of putting the value into, say, the type-neutral id object pointer. Then we actually check the object’s type to ensure we’ve got what we want:
Class stringClass = [NSString class];
NSUInteger deskCount = desks.count;
for (NSUInteger i=0; i<deskCount; i++) {
	NSString* studentName = [desks objectAtIndex:i];	// no cast needed for type-neutral ''id'' return value
	if ([studentName isKindOfClass:stringClass]) {
		NSLog(@"%@ is assigned to desk %u (of %u)", studentName, (i+1), deskCount);
		
		// perform other operations with the student''s name
	}
}

Doing this saves a line of code, making the signal stand out from the noise a little more. And depending on how the compiler decides to optimize that portion of the code, it may possibly reduce the code’s stack footprint by sizeof(NSString*).
It’s not a big optimization, and even if it were implemented across a large codebase, it probably wouldn’t make a perceptible difference performance-wise.
But I use it because it’s a little bit less text for my brain to parse through as I’m reading my code. I also like being able to describe a coding style as “optimistic,” even if a more apt description of the technique would be Trust, but Verify.
Evan Coyne Maloney Senior Software Engineer, Mobile Team Gilt Groupe
Protip: While the example above allowed me to illustrate optimistic type-casting, it deliberately ignores a more efficient way of handling the particular problem described. In the example above, if we know that our array will never contain anything other than NSStrings and NSNulls, we can rely on the fact that NSNull is a singleton and avoid the overhead of the [obj isKindOfClass:stringClass] call altogether.
Instead, all we need to do is compare the pointer of the object returned by the collection against the pointer of the singleton NSNull instance:
id nsNull = [NSNull null];
NSUInteger deskCount = desks.count;
for (NSUInteger i=0; i<deskCount; i++) {
	NSString* studentName = [desks objectAtIndex:i];
	if (studentName != nsNull) {
		NSLog(@"%@ is assigned to desk %u (of %u)", studentName, (i+1), deskCount);
		
		// perform other operations with the student''s name
	}
}

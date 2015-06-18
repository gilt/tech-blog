---
layout: post
title: The Human Side of Scala
date: '2013-06-18T09:21:00-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/53274999512/the-human-side-of-scala
---
What do books, programming languages and cars have in common? They enter our lives carrying that proverbial “new smell”: the elusive but potent combination of possibilities, expectations and hopes that “this one will be better than the last.” Sometimes it fades quickly because of poor quality or unfortunate design choices, but every once in awhile the initial excitement matures into something that keeps you coming back for more—the first small, joyful step turns into a happy little walk, and then becomes a journey.

Scala seems to be one of those languages with deep, powerful abstractions and an ever-expanding toolbox. It lures you in with simple, borderline magical examples, and then keeps you engaged by revealing something new and intellectually delicious at every step. The learning curve can be steep, but it’s ultimately rewarding. When you move past “hello worlds” and simple web applications, a question inevitably arises: “Am I doing it right? Is this what good Scala code is supposed to look like?”

Scala creator Martin Odersky tried to answer that very question in “Scala with Style,” his keynote address at this year’s Scala Days conference (organized by Typesafe and sponsored by Gilt). The same concern was echoed by Dick Wall in his excellent talk about simple API design. I find it telling that, instead of wooing the crowd with something clever, specialized and highly technical, Odersky and Wall instead chose to focus on a topic that’s softer yet more difficult, less well defined and more controversial: how to write good code.

All of this year’s Scala Days talks were recorded, and Typesafe has promised to post them online at Parleys sometime soon. I highly recommend watching both presentations whenever they become available. I couldn’t possibly do them justice by summarizing the contents, so instead I’d like to share the one point that stood out in my mind, and illustrate it with a couple of code examples.

While talking about language design choices, Odersky mentioned the following:


Scala combines elements from both object-oriented and functional programming methodologies;


Scala is expressive;


Scala is un-opinionated.

To put that into a sentence: “Scala empowers you to express what you think is important, not what the language designer deems important.” You need to decide what values, preferences and character traits will show through the code you write. To elaborate:


Maybe you are good at holding many things in your head at once, and like to write incredibly long map-flatMap-filter-combinator statements using infix notation for fun and profit;


Maybe you are adept at manipulating complex functional abstract entities like it’s Play-Doh. I am not sure exactly what that would look like, but it sounds like a way to win bets at Functional Programming meetups;


Maybe you have a crush on monads and cannot live without them;


Maybe “Concurrency” is your middle name, and you are physically unable to write code without Actors;


Maybe you love clean code, and confusingly named methods that stretch over more than 15 lines make you cry.

If that last point about clean code resonates with you, then Scala could be a great fit: we don’t have to tailor our code to “robots” as much as when programming in some other languages. A lot of clever engineering went into Scala to support flexible syntax, type inference and the like. With all that tech under the hood, we can afford to reallocate some of our brain cycles toward creating more “human-friendly” code. Here is some advice from Martin Odersky and Dick Wall:

Pick meaningful names for classes, functions and variables.

Use inline def’s and val’s to name intermediate results.

Compare the following two pieces of code (sorry for the lousy formatting):

accounts.filter(_.getUserId == userId)
{% highlight python %}
.map( tx =>
  CurrencyConvertors.getConvertorFrom(tx.getCurrency)
    .amountInUSD(tx.getAmount)
{% endhighlight %}


vs.

val usersDeposits = accounts.filter(_.getUserId == userId)
{% endhighlight %}

def convertAmountToUSD(tx: Transaction) =
{% highlight python %}
{% endhighlight %}

usersDeposits map convertAmountToUSD sum


The introduction of inline val and def makes it easier to understand what’s happening in the second code snippet, because the very last line captures the intent of the whole block.

Use infix notation sparingly.

The following code is from one of the keynote slides. If the line got any longer in the first example, you’d be in danger of losing your train of thought half-way through–especially because one of the variables is named filter, which can be confused with Iterable.filter():

mapping add filter map second flatMap third
xs map f mkString


vs.

mapping.add(filter).map(second).flatMap(third)
xs.map(f).mkString


Be careful with operators.

something <++= blah
(z /: xs)(op)


vs.

???
(xs.foldLeft(z))(op)


Think about your audience. Will people who read your code (or, just as importantly, your future self) know what you meant by “<++="? It’s a real Scala function defined in some package, but I can’t tell you what it does because I didn’t catch its description, and it’s impossible to find on Google. Unless you are sure that readers of your code will understand it, don’t use it.

Don’t hesitate to use var’s to capture local mutable state if it makes code clearer.

Don’t nest many levels deep.

Favor simplicity over cleverness.

Given how powerful Scala is, and how easy it is to write complex code, it’s important to spend time on readability and simplicity. Remember that Scala is all about choices, and it’s up to you to make the right ones.

Update: Video recordings of ScalaDays 2013 talks are now available online.

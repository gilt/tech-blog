---
layout: post
title: Five Simple Lisp Tips Guaranteed to Boost Your Productivity
date: '2014-07-03T10:57:00-04:00'
tags:
- clojure
- vim
- lisp
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Scott Thompson
- functional programming
- how-to
- productivity
- function-call
- try-catch
- Lisp syntax
- Emacs
- Rainbow Parentheses
- ParEdit
- abstract syntax tree
- try-catch-finally
- brackets
- barfing
- slurping
tumblr_url: http://tech.gilt.com/post/90661198239/five-simple-lisp-tips-guaranteed-to-boost-your
---

Lisp is an interesting language. Its emphasis on functional programming and properties such as homoiconicity make it quite different from other languages. Although it’s not suited for all developers, those who have experienced building large applications in other languages may appreciate the simplicity that Lisp provides.
When I ask other developers for their thoughts on Lisp, the most common response I receive is, “Why are there so many brackets?” As it turns out, Lisp’s brackets establish some consistency across the language that allows for some neat code-writing tricks. So neat, in fact, that they can make coding a Zen-like experience. Read these tips and you’ll soon be able to make onlookers wonder how you’re able to make code fly around the screen so quickly and elegantly–and with just a few keystrokes. 
Lisp Refresher
For those of you who aren’t quite clear on Lisp syntax, here are a few basic things to know:
Everything is a list
The first element in every list is the “function call position”
That’s it! Easy, right? Let me show you a few examples written in Clojure (a dialect of Lisp) to make things more concrete. First, a standard “Hello World” example:

(println "Hello World")

In Clojure, you create lists by using rounded parentheses. The first element in this list is println, so we are calling a function called println with a single argument “Hello World”.
Next, we create a new function called inc:

(defn inc
  "Define a fn that increments a number by 1"
  [x] (+ x 1))

 The first element (the one in function-call position) calls a special function called defn that allows us to create a new function. The other arguments are:
The name of the function we want to define–in this case, inc
A string comment that we can use as a human-readable description of what our function does
[x] is a vector of the arguments that our new function will receive
The body of our function
In this final example, we create a try-catch statement:

(try
  (/ 1 0)
  (catch ArithmeticException e (println "Kaboom!"))
  (finally (println "We’ve recovered!")))

We can start to see from this example how lists can be nested to provide richer programming capabilities. This nesting actually results in a tree structure (which in compilers is referred to as an ‘abstract syntax tree’) that provides the basis for some interesting coding workflows.
The Structure of Lisp
To illustrate what this abstract syntax tree looks like, let’s draw the try-catch example as a tree:I’ve omitted the “finally” block to keep the illustration compact, but it should be clear now how we can visualize Lisp code as a tree. The workflow tips in this article revolve around making edits to this tree: navigating to parent nodes, moving a branch, removing levels, etc.
***I’ll provide these tips specifically for Vim, but there are equivalents in Emacs as well if you prefer that.***
Without further ado!
Tip #1: Give your brackets some color 

‘Rainbow Parentheses’ is a plugin for text editors that will change the color of your brackets depending on their depth in a list. This enables you to visually recognize the start and close of a particular list. Once we can visualize this, it becomes much easier to jump between depth levels.
In the above gif, the cursor starts inside the println then makes jumps upward to each parent node in the tree (println -> catch -> try). These jumps can be performed with the ParEdit plugin while in normal mode by pressing "(". 
Tip #2: Keep your parens balanced

There’s nothing worse in Lisp than having unbalanced parentheses–especially if you have blocks of code that include several levels of nesting. Finding which block is missing a closing bracket can become a nightmare. Fortunately, ParEdit can prevent us from having this problem.
Say we have a try-catch-finally block and wish to delete the ‘finally’ clause. In Vim, we can easily remove this entire line when in normal mode by pressing ‘dd’. The problem is that if we do this, we will make our parentheses unbalanced by deleting the closing bracket of the try block (in the above gif, the closing red bracket).
The ParEdit plugin solves this by forcing our brackets to always remain balanced. With paredit enabled we can perform ‘dd’ to delete the line and delete everything except for any brackets necessary to maintain balance. 
Tip #3: Learn motions. Master the brackets!

Vim provides motions right out of the box, with no additional plugins needed. The handiest motions for dealing with parentheses are “select in” and “select all.” These can perform actions on an entire list in just a few keystrokes. For example, say in our try-catch block we want to return positive infinity instead of print a message. Place the cursor inside the println list, issue a “select all,” and hit “c” for “change.” This will replace the entire println list in just three keystrokes.
Note that “select in” will select everything inside the parentheses, while “select all” will select everything inside the parentheses (including the parentheses themselves). This command will work with round brackets, curly brackets, square brackets and even quotations, making it useful in other non-Lisp languages as well. 
Here’s a cheat sheet for using these commands:
viw - select in word
vi( - select in round bracket
vi{ - select in curly bracket
vi[ - select in square bracket
vi” - select in quote
ciw - change in word
ci( - change in round bracket
ci{ - change in curly bracket
ci[ - change in square bracket
ci” - change in quote
 va( - select all round bracket
va{ - select all curly bracket
va[ - select all square bracket
va” - select all quote
 ca( - change all round bracket
ca{ - change all curly bracket
ca[ - change all square bracket
ca” - change all quote
Tip #4: Nest with ease!

Say we want to assign the result of our try-catch statement to a variable name. This can be done in four easy steps:

Place your cursor on either the opening or closing bracket of the try block (one of the red brackets)


Hit “v%” to select everything up to and including the matching bracket


Using the ParEdit plugin hit <Leader>w( to wrap the select text in another set of parentheses


Inside the new parentheses, write the code to make the assignment


(Optional) In the gif I have done an optional fifth step to re-indent the code by selecting the block and pressing the equal sign. “=” is a standard Vim command to re-indent.

Tip #5: Barf and Slurp!

 Barfing and slurping are terms used in the ParEdit plugin. These operations depend on the location of your cursor. Barfing will eject (“barf”) either the first or last element of the list where your cursor is placed. Slurping is the opposite: A slurp will find the first element to either the left or right of the list where your cursor is and slurp that element into the list.
In our try-catch example, say we create a new function called my-function. We then want to move the try-catch block inside this function so that we can call it later. Naively, we could select the try-catch block, then cut and paste it into the function body. Alternatively, in two keystrokes we can slurp the entire try-catch block into the function body! We can perform the opposite operation by then barfing the try-catch back out. 
The concept might take a few minutes to sink in, but once you understand these operations you will be able to push code around like a pro.
Vim Plugins
Here are links for the vim plugins I used in the above demos:
Vim Clojure
Rainbow Parentheses
ParEdit
(Lambda bird formation photo by Sigfrid Lundberg)

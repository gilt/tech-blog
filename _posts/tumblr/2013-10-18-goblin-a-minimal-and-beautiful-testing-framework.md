---
layout: post
title: 'Goblin: A Minimal and Beautiful Testing Framework for the Go Language'
date: '2013-10-18T15:48:00-04:00'
tags:
- Node.js
- open source
- testing
- frameworks
- Gomega
- goblin
- go
- golang
- Jonathan Leibiusky
- Goblin
tumblr_url: http://tech.gilt.com/post/64409561192/goblin-a-minimal-and-beautiful-testing-framework
---

Inspired by the flexibility and simplicity of Node’s Mocha, but frustrated by the rigorousness of the Go way of testing, my friend Marcos Nils and I set out to create a new tool to write self-describing and comprehensive code. The result (and just in time for Halloween): Goblin.
What do I get with Goblin?
Preserve the exact same syntax and behavior as Node.js’s Mocha
Nest as many Describe and It blocks as you want
Use Before, BeforeEach, After and AfterEach for setup and teardown your tests
No need to remember confusing parameters in Describe and It blocks
Use a declarative and expressive language to write your tests
Plug different assertion libraries (Gomega supported so far)
Skip your tests the same way as you would do in Mocha
Two-line setup is all you need to get up and running
How do I use it?
Since go test is not currently extensive, you will have to hook Goblin to it. Just add a single test method in your test file, and all your goblin tests will be implemented inside this function.

package foobar

import (
    "testing"
    . "github.com/franela/goblin"
)

func Test(t *testing.T) {
  g := Goblin(t)
  g.Describe("Numbers", func() {
      g.It("Should add two numbers ", func() {
          g.Assert(1+1).Equal(2)
      })
      g.It("Should match equal numbers", func() {
          g.Assert(2).Equal(4)
      })
      g.It("Should substract two numbers")
  })
}


Output will look something like this:

Nice and easy, right?
How do I use Goblin with Gomega?
Gomega is a nice assertion framework, but it doesn’t provide a nice way to hook it to testing frameworks. It should just panic instead of requiring a fail function. There is an issue about that here. While this problem is being discussed and hopefully fixed, you can use Gomega with Goblin. How to do it:

package foobar

import (
    "testing"
    . "github.com/franela/goblin"
    . "github.com/onsi/gomega"
)

func Test(t *testing.T) {
    g := Goblin(t)

    //special hook for gomega
    RegisterFailHandler(func(m string, _ ...int) { g.Fail(m) })

    g.Describe("lala", func() {
      g.It("lslslslsls", func() {
        Expect(1).To(Equal(10))
      })
    })
}


What’s next for Goblin?
Marcos and I will soon address the issues still pending with Goblin. Meantime, feel free to contribute and send us your pull requests (with tests, please).
Special thanks to Leandro Reox (Leitan) for designing the Goblin logo.

---
layout: post
title: Which Scala Testing Tools Should You Use?
date: '2013-09-27T13:37:33-04:00'
tags:
- Scala
- ScalaCheck
- specs2
- ScalaTest
- Mockito
- Daniel Hinojosa
- Lukasz Szwed
- Bill Venners
- JUnit
- TestNG
- Java
- business-driven development
tumblr_url: http://tech.gilt.com/post/62430610230/which-scala-testing-tools-should-you-use
---

By Gilt Senior Software Engineer Lukasz Szwed
“Scala testing systems have also stepped out on their own and created some of the most mind-blowing testing tools found in any language.” –Daniel Hinojosa, author of Testing in Scala
At Tuesday’s Dublin Scala Users Group meetup, organized by Gilt, I presented a tech talk on standard test-driven development practices available to Scala developers. These include ScalaTest, specs2, ScalaCheck, and various mocking frameworks. The event was great: we kicked things off with wood-fired pizza and a very good selection of beers. As for my presentation? Well, I noticed that many of you couldn’t make it, so I’ll share some of the highlights.
I started things off by introducing ScalaTest and specs2, which share a few things in common:

both are written in Scala


neither provides a one-size-fits-all testing framework, but are platforms that allow for different styles of testing


both offer great support for pending test cases


they’re mature and production-ready


they’re well-integrated with sbt 


both borrow ideas from Cucumber–the first framework that truly showed how business professionals and other non-developers could write feature descriptions without using source code

About that last point: Cucumber is written in and for Ruby. For Java, very few tools exist that enable Test-Driven Development (TDD), BDD (Business-Driven Development), DDD (Design-Driven Development), or ATDD (Acceptance Test-Driven Development), much less make those processes fun. Experienced Java programmers know and have decent unit tests for our code–but working with tests written in JUnit or TestNG is brittle and tedious, and the test code does not look as modern as Scala code does. Also, neither JUnit nor TestNG offers ways for non-programmers to create tests. 
Writing tests in or specs2 can help you turn old-but-good JUnit/TestNG code into actively used assets and eliminate the need for documentation. And that’s fun!
ScalaTest
Built by Bill Venners, ScalaTest integrating the best aspects of Cucumber while offering deep integration with JUnit and TestNG and lots of flexibility when it comes to scaling. At Gilt, we have learned that switching contexts between languages and frameworks isn’t always the best or most efficient approach, so we use ScalaTest for all of our tests: unit tests, functional tests, Selenium tests, and performance tests. Even though Play Framework–which we use and love–comes with specs2 support by default, we have replaced it with ScalaTest in order to make testing simple and consistent across all of our systems. 
As Linus Torvalds–the father of the Linux kernel–says, “Talk is cheap. Show me the code.” Here is extremely simple test case, written in good-old JUnit style but presented in the ScalaTest framework:

import org.scalatest.junit.JUnitSuite

import org.junit.Test

class EmployeeTestJUnit4 extends JUnitSuite {

 @Test def testCreateEmployeeObjectAndProperties() {

   val employee = new Employee("Lukasz", "Szwed")

   assert(employee.firstName === "Lukasz")

 }
Using ScalaTest to refactor tests written in JUnit requires very little effort. And thanks to ScalaTest JUnitSuite, you can run tests with either the JUnit or ScalaTest framework–a pretty powerful feature. You can still use JUnit’s assertion (assertEquals, assertTrue, etc.), but can also use the more concise assertion syntax that comes with ScalaTest.
Special features
In my Tech Talk, I highlighted two of my (and my colleagues’) favorite ScalaTest aspects: Matchers and FeatureSpec. Both give you hundreds of options to verify what you are testing, work more quickly, and structure your tests to fit your own unique specifications.
 Our tech talk audience loved Matchers, a feature that allows you to write code using domain-specific language (DSL)–in other words, pure English–for expressing assertions in tests. In addition to making testing more fun, it also makes source code look better and more modern (and, consequently, is perfectly in line with the whole concept of Scala). Consider this sample test:

result should equal (3)
result should === (3) 
result should be (3)   
result shouldEqual 3  
result shouldBe 3

Instead of:

assertEquals(3, result)

If you’re like me, you want to write your code to be as readable by humans as possible. Matchers will help you achieve this.
After my tech talk, several attendees asked me where to discover more examples of Matchers’s magic. The audience also fell in love with FeatureSpec, which offers a BDD-friendly way of performing tests that are higher-level than unit tests. Here’s an example of a test written with FeatureSpec:

import org.scalatest.{Matchers, GivenWhenThen, FeatureSpec}

class FeatureSpecTest1 extends FeatureSpec with GivenWhenThen with Matchers {

 info("As an employee object consumer")
 info("I want to be able to create an employee object")
 info("So I can access the first name and last name")
 info("And get the employee full name when I need it")
 info("And also get the Social Security Number")

 feature("Employee object") {
   scenario("Create an employee object with first and last name") {

     Given("an Employee object is created")
     val employee = new Employee("Lukasz", "Szwed")

     Then("the first name and last name should be set")
     val firstName = employee.firstName
     firstName should be ("Lukasz")

     val lastName = employee.lastName
     lastName should be ("Szwed")

     Then("the full name should be set")
     employee.fullName should be (firstName + " " + lastName)

     Then("the ssn should be set")
     employee.ssn should be ("000-00-0000")
   }
 }
}

When run with sbt, this test will produce the human readable output in pure English, which is like a feature specification with all of the BDD flavor of Given/When/Then. This makes it easy for non-developers to understand, as the following example shows:


specs2
Specs2 is an open source test framework designed to help with writing executable software specifications. Developed by Eric Torreborre, it allows you to draw a clear line between unit tests–which it calls “unit specifications”–and full-system tests, which are often called acceptance specifications. Well-written documentation is one of its major advantages.
specs2 is evolving in the same direction as ScalaTest and offers a similar end result for the user, but is distinguished by its implementation, structure and design. specs2 tests are asynchronous, and each runs in its thread using a Promise (it works well with Akka, as you might expect). Promises are processes that run on separate threads asynchronously using Actors and send objects–in this case, an ExecutedResult to one another. From what I’ve seen, there’s nothing else on the market as highly advanced as specs2 for dealing with tests. 
Here’s an example of a simple unit specification in specs2:

import org.specs2.mutable._

class EmployeeUnitSpecification extends Specification {

 "An employee" should {
   "return the same first name and last name given to it''s constructor" in {
     val employee = new Employee("Lukasz", "Szwed")
     employee.firstName must be("Lukasz")
     employee.lastName must be("Szwed")
   }

   "throw StringIndexOutOfBoundsException if invoking charAt on too short name" in {
     val employee = new Employee("Lukasz", "Szwed")
     employee.lastName.charAt(10) must  throwA[StringIndexOutOfBoundsException]
   }

   "return the full name combined of first name and last name" ! pending
 }
}

The code above illustrates specs2’s excellent support for pending test cases–a feature that is one of my favorites, and something that JUnit and TestNG truly lack. A pending test, by the way, is a test that has a name but is not implemented yet, or is partially implemented but not ready for execution. The big advantages of pending tests become more apparent in the design and early implementation stages, when developers typically try to describe system behavior before writing any code. Pending tests are helpful in defining specifications and functionality that need to be implemented in the production code.
Acceptance specifications are similar to test specifications, with this key difference: They separate what a test is expected to do from what actually happens during the test. Consider this example:


import org.specs2._

class EmployeeAcceptanceSpecification extends Specification { def is =
 "An employee should"                                                            ^
   p^
   "return the same first name and last name given to it''s constructor"          ! e1^
   "throw StringIndexOutOfBoundsException if invoking charAt on too short name"  ! e2^
   end

 def e1 = {
   val employee = new Employee("Lukasz", "Szwed")
   employee.firstName must be("Lukasz")
   employee.lastName must be("Szwed")
 }

 def e2 = { new Employee("Lukasz", "Szwed").lastName.charAt(10) must throwA[StringIndexOutOfBoundsException] }
}


In the end, you’ll note, the unit specification and acceptance specification tests look pretty familiar. 
It’s always good to have options, but if you’re looking for a testing framework in Scala you should choose either ScalaTest or specs2. Because they both integrate so well with sbt, any other test library that attracts interest from the open source community should be integrated with either ScalaTest or specs2 (or both). When writing production code and jumping from project to project, however, you should pick one of them and stick to it.
ScalaCheck
ScalaCheck is a fully automated test generation tool based on the QuickCheck open source project used in Haskell. ScalaCheck includes test define generators that are responsible for generating test data in ScalaCheck. According to the user guide:

“a generator can be seen simply as a function that takes some generation parameters, and (maybe) returns a generated value. That is, the type Gen[T] may be thought of as a function of type Gen.Params => Option[T]. … Conceptually, though, you should think of generators simply as functions, and the combinators in the Gen object can be used to create or modify the behaviour of such generator functions.”

The true magic comes with forAll, which takes generators and creates universally quantified properties for a test.
ScalaCheck is well integrated with both ScalaTest and specs2, which is a critical feature. The following example shows how ScalaCheck can be used with ScalaTest:

import org.scalatest.FunSpec

import org.scalatest.prop.GeneratorDrivenPropertyChecks
import org.scalacheck.Gen

class ScalaTestWithScalaCheck extends FunSpec with GeneratorDrivenPropertyChecks {

 val gen1 = Gen.oneOf("Abigail", "Amber", "Bertha", "Cally", "Diana", "Esther", "Frannie", "Texarkana", "Justine")
 val gen2 = Gen.oneOf("Adams", "Valles", "Simons", "Gomez", "Patel", "Mehra", "Groenfeld", "Thatcher", "Greenfield")

 describe("An employee object") {
   it("has valid full name") {
     forAll(gen1, gen2) {
       (firstName: String, lastName: String) =>
         new Employee(firstName, lastName).fullName == firstName.trim() + " " + lastName.trim()
     }
   }
 }

 describe("An employee object should have ssn number") {
   it("has valid random ssn number") {
     forAll((Gen.choose(000, 999), "a"), (Gen.choose(00, 99), "b"), (Gen.choose(0000, 9999), "c")) {
       (a: Int, b: Int, c: Int) => {
         val ssn = a + "-" + b + "-" + c
         info(ssn)
         new Employee(gen1.sample.get, gen2.sample.get, ssn).ssn === ssn
       }
     }
   }
 }
}


As the simple example above shows, we can use ScalaCheck to easily create hundreds or even thousands of test properties for a test with the certainty that we’ve also accounted for lots of outlier cases.
Mocking
One of my favourite definitions of the word “mock” comes from Testing in Scala, the book quoted at the beginning of this post. It goes like this: “[Mocking] is analogous to the stand-in opponent during preparation for a political debate. The opponent would likely be a campaign team member, but she will have a set of answers already prepared to debate the candidate who needs to train for the big event.”
This brings me to EasyMock, Mockito and ScalaMock. These testing tools integrate well with Scala and help us to avoid the common problems of over-complexity and excessive dependencies. They also make tests run faster. 
ScalaMock: This one deserves special attention because it’s a framework fully written in Scala for Scala developers. It tries to address challenges by “mocking” (in this case, imitating) Scala code. With ScalaMock, you can easily gain full support for polymorphic (type-parameterized) methods, operators (methods with symbolic names), overloaded methods, traits, companion objects, and macros. If you are new to Mocking with Scala, give a try to ScalaMock. 
EasyMock: the first Java Mock Framework. ScalaTest provides EasyMockSugar, which helps to both integrate and simplify the use of EasyMock.
Mockito: The first of the later-generation mocking frameworks to provide mocking options for concrete Java classes. Both Mockito and EasyMock provide similar functionality, but Mockito has the edge in offering more options–which might be why developers tend to stick to it and use it even with Scala code. At Gilt we started using Mockito back when we were still a Java shop (we began migrating our services to Scala in 2011). It works well for us, so there is no immediate plan to replace it with ScalaMock. 
Wrap-up
For me, the most interesting part of the meetup was the discussion about how we are doing testing at Gilt. I’ll share more details on that in an upcoming post. Meantime, stay tuned for the next Scala Tech Talk hosted by Gilt in Dublin. I hope to see you there.

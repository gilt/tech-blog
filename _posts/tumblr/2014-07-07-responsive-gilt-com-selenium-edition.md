---
layout: post
title: 'Responsive Gilt.com: Selenium Edition!'
date: '2014-07-07T16:25:00-04:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Jose Sanchez
- responsive design
- CSS
- CSS3
- JavaScript
- Selenium
- testing
- Special Operations
- ScalaTest
- jQuery
- software engineering
- responsive design series
tumblr_url: http://tech.gilt.com/post/91076463569/responsive-gilt-com-selenium-edition
---
In our last blog post on responsive design at Gilt, my colleague Greg Mazurek explained why we use in-selector CSS media-queries instead of blocks. The impetus for choosing this pattern was to make our code less brittle to future development. Today I’ll talk about how we’re applying the same principle to our testing practices.
We’ve thought a lot about how we can design our code to minimize–even prevent–unexpected adverse changes made during future development cycles. The Gilt engineering team uses automated testing for all of our apps, but in transitioning to a responsive design environment many of these tests have become inapplicable because page elements have been shifted, hidden, altered, or added. Furthermore, if a developer makes a change to a CSS property for a tablet experience, she needs to know whether this change might adversely affect the mobile web experience. A modified class name, a JavaScript side-effect, or a CSS specificity change are three possible negative consequences of such a change. 
To deal with this potential problem, the Special Ops team has been writing Selenium-automated tests for responsive pages–more specifically, for each browser responsive breakpoint. (If you are unfamiliar with Selenium, it is a web testing framework that allows you to automate your web application within the browser. Its robust API interacts with your website the way a user would, and can handle automating most scenarios.) First, we have a browser resize itself to the breakpoint we want to test–for example, iPhones in portrait view fall under a maximum width of 479px, while in landscape its a minimum width of 480px, and a maximum width of 767px. With Selenium, via the web driver object, this is very easy to achieve.
Here is a small snippet of what that code might look like:
def resizeWindow(width: Int, height: Int)(implicit webDriver: WebDriver) = {
  webDriver.manage().window().setSize(new org.openqa.selenium.Dimension(width, height))
}


This reusable piece of code is what you’ll want to execute before the start of each test. Execute it before, not after, the initial page load, to ensure your site responds as it natively would at those breakpoints (rather than scaling your site down–which could cause inconsistencies with the view). Executing the code before the initial page load will also help you to ensure the automation doesn’t start before the browser has fully scaled down.
Example
To help you ensure that a page responds correctly to the appropriate viewport of the screen or device, here is a very basic test. It uses Selenium with ScalaTest and a dash of jQuery (there are many ways to test, but this is my preferred way):
describe("When resizing the browser to 479px and navigating to product listing page") {
  it("should fit all the elements within the 479px limit") {
    val expectedPageWidth = 479
    resizeWindow(width = expectedPageWidth, height = 800)
 
    webDriver.navigate().to("http://www.gilt.com/sale/men")
 
    // Using scrollWidth instead of width(), to get the true width of the html container
    val actualPageWidth = webDriver.asInstanceOf[JavascriptExecutor]
      .executeScript("return $(''html'')[0].scrollWidth;").asInstanceOf[Long]
 
    actualPageWidth.toInt should be <= expectedPageWidth
  }
}


(Note: Your page should not be scrollable to the right.)
That’s all there is to it. If you have no other test, at least this one will ensure your site is still responsive. But we highly recommend adding more specific tests that target the functionality of the site.

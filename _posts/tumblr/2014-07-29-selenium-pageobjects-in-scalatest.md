---
layout: post
title: Selenium PageObjects in ScalaTest
date: '2014-07-29T15:34:00-04:00'
tags:
- Gilt
- Gilt Tech
- Gilt Groupe
- gilttech
- Darrell Roarty
- Selenium
- testing
- Page Object pattern
- WebDriver
- ScalaTest
- rich actions
- simple actions
- Assertions
- BrowserAction
- software engineering
- automation
- Selenium WebDriver
- EventType
- WaitTool
- Locators
- checkpoints
- using page objects in tests
- PageObjects
- PageObject
- Page Object
tumblr_url: http://tech.gilt.com/post/93234049519/selenium-pageobjects-in-scalatest
---

PageObjects enable you to take a group or collection of elements on a page that share some commonality and group them together. In general, a PageObject can be any web page, but can also be broken down into more precise PageObjects. If a Page has elements and services–or some repeated group of elements and services–that can logically be grouped together, those elements and services can be modeled as PageObjects.
A PageObject can be thought of in the context of a full Page or grouped objects on a Page. Here’s what Selenium has to say about them:

“The PageObject pattern represents the screens of your web app as a series of objects … PageObjects can be thought of as facing in two directions simultaneously. Facing towards the developer of a test, they represent the services offered by a particular page. Facing away from the developer, they should be the only thing that has a deep knowledge of the structure of the HTML of a page (or part of a page).
It’s simplest to think of the methods on a PageObject as offering the “services” that a page offers rather than exposing the details and mechanics of the page. Because we’re encouraging the developer of a test to try and think about the services that they’re interacting with rather than the implementation, PageObjects should seldom expose the underlying WebDriver instance. To facilitate this, methods on the PageObject should return other PageObjects. This means that we can effectively model the user’s journey through our application.”
– Selenium

At Gilt, we’ve adopted the practice of breaking a Page into smaller parts that can be modeled as PageObjects. We’ve done this to generate fewer lines of code and to make PageObjects easier to understand and analyze.
A PageObject should be an object; otherwise, it should be a class with constructor params that provide the context. For example:

package com.giltgroupe.repository.page.foo

/**
 * Foo PageObject.
 */
object Foo extends FooActions with FooAssertions{
 def doSomethings
     (implicit eventType: EventType, driver: WebDriver): Foo.type = {
     clickSomething
       triggerSomething
       selectSomething
    this
  }
}

package com.giltgroupe.repository.page.foo

/**
 * Foo PageObject.
 */
case class Foo(foo: String) extends FooActions with FooAssertions{
 def doSomethings(foo: String)
     (implicit eventType: EventType, driver: WebDriver): Foo.type = {
     clickSomething(foo)
       triggerSomething
       selectSomething
    this
  }
}
Here, the PageObject Foo can extend Actions. It can also be mixed with Assertions and even Rich Actions.
More on Actions
Actions can either be simple or rich.
Simple Actions:
Provide a PageObject return type.
Are located in an Actions trait.
Should simulate user actions e.g., clickSomething, triggerSomething, selectSomething. Should not make any Assertions. In other words, an Action does one thing well.
Assertions should happen as part of the test and should not be included in the Action. If there is an Assertion that is reusable, it should be located in an Assertions trait for the PageObject.
Rich Actions: Are located in the PageObject Can be a number of grouped simple actions which are commonly used. Simple vs. Rich Actions A rich action is made up of a number of Simple Actions. clickSomething is a simple action described above. triggerSomething and selectSomething are also simple actions. Calling them together makes a it a rich action. Here’s an example of a simple action:
private[foo] trait FooActions extends BrowserAction {

  def locators = FooLocators  

  def clickSomething(foo: String)
     (implicit eventType: EventType, driver: WebDriver): Foo.type = {
     click(locators.myDefLocator(foo))
    this
  }

 def goFooUrl(url: String)
    (implicit driver: WebDriver): Foo.type = {
       go to url
 }

And here is a Rich Action:

  def doSomethings(foo: String)
     (implicit eventType: EventType, driver: WebDriver): Foo.type = {
     clickSomething(foo)
       triggerSomething
       selectSomething
    Foo
  }

The Gilt engineering team has been discussing the value of rich vs. simple action terminology. We haven’t yet decided if locating the rich actions in the PageObject is valid, or if rich and simple actions should just be actions because they all live inside the Actions trait.
BrowserAction
Gilt’s Selenium automation is built around the ScalaTest Framework. The WebBrowser trait, which we can see in the following code example, can be found here. BrowserAction is a wrapper for Selenium WebDriver that removes much of the required boilerplate. We’ve been using BrowserAction so that engineers who aren’t familiar with Selenium can still write cool end-to-end tests (instead of copying and pasting code):
/**
   * Click on a WebElement by using native or synthetic event simulation.
   *
   * @param query : WebBrowser#Query to define the webElement
   * @param eventType : Native or Synthetic.
   */
  def click(query: WebBrowser#Query)(implicit eventType: EventType, driver: WebDriver) {
    WaitTool.waitForElementClickable(query)
    eventType match {
      case Native => query.webElement.click()
      case Synthetic => JQueryHelper.click(query)
    }
    JQueryHelper.pageIsLoadedAndAjaxIsCompleted()
  }
The click action is based on the implicit event type passed to it by the test, and waits for an element to become clickable before it carries out the action.
The code above shows a simple action, which performs a mouse click on the page on the element. This is subsequently passed as an argument to the function click. There is an implicit, EventType, which defines how the browser should behave–either Native or Synthetic.
The Gilt team has developed a library called WaitTool, which handles implicit waits and expected conditions. The click action uses WaitTool, which hides the complexity of making sure that the element–which was passed to the click function–can be clicked. As soon as the element becomes clickable by Selenium WebDriver, a mouse click is performed (dependent on the EventType). The last step of the action click is to wait for page to load, and also wait for all Ajax calls to complete.
The click action nicely shows how you can hide some of Selenium’s complexity behind a simple action. As a result, people who lack Selenium WebDriver expertise or a full understanding of what goes on under the hood can write a test and get a clear API (click function) to use.
With WaitTool, upon entry into an action we can wait for expected conditions to be true, then carry out an action:
/**
   * Wait for the element to clickable in the DOM.
   *
   * Returns an Option of the first WebElement using the given method.
   *
   * @param query selector to find the element
   * @param timeOutInSeconds time to wait until returning None
   * @return an Option of the first WebElement using the given method, or (None if the timeout is reached)
   */

  def waitForElementClickable(query: WebBrowser#Query,
                              timeOutInSeconds: Int = DefaultWaitTimeForElement)
                             (implicit driver: WebDriver): Option[WebElement] = {
    try {
      driver.manage().timeouts().implicitlyWait(0, TimeUnit.SECONDS)
      val element = {
        val wait = new WebDriverWait(driver, timeOutInSeconds)
        wait.until(ExpectedConditions.elementToBeClickable(query.by))
      }
      driver.manage().timeouts().implicitlyWait(DefaultWaitTimeForElement, 
                                                TimeUnit.SECONDS)
      Some(element)
    } catch {
      case e: Exception => None
    }
  }
To ensure we can exit the action correctly we then wait for the DOM or page to be loaded, and for all Ajax calls and other actions to be completed, before returning control to the caller or carrying out the next called Selenium action. This enables us to instantly and easily see how our work flow is naturally progressing. Without such a library, test cases look muddy, unclear and unreadable.
  /**
   * Ensure the page is loaded and AJAX calls are completed using jQuery.
   */
  def pageIsLoadedAndAjaxIsCompleted()(implicit driver: WebDriver) {
    eventually {
        withClue("Ajax calls may not have completed within time specified") {
            executeScript("return jQuery.active")
             .asInstanceOf[Long] shouldBe (0)
        }
    }

    eventually {
        withClue("Document ready state was not [complete] within time 
                  specified by eventually clause.") {
              executeScript("return document.readyState")
              .asInstanceOf[String] shouldEqual ("complete")
        }
    }
  }
Locators
Locators should be objects, not traits. As objects, locators are naturally namespaced and give compile-time checking. You can’t mix in two locator traits and, without knowing it, have selectors overridden. e.g., FooLocators.myLazyLocator. Selectors that require parameters are defs; otherwise, they are lazy vals.
object FooLocators extends WebBrowser {
    lazy val myLazyLocator: Query = cssSelector("[data-gilt-test=’foo’]")
    def myDefLocator(foo: String): Query = cssSelector(s"[data-gilt-test=’$foo’]")
}
Assertions
Assertions are generally located with tests, but commonly used assertions can be implemented as an assertions trait in the PageObject.
trait CartAssertions extends WebBrowser with Checkpoints with Matchers {
  self: Foo.type =>

  def assertSomething()(implicit eventType: EventType, driver: WebDriver): Foo.type ={
  
      val cp = new Checkpoint    
      cp {  assertSomething  should be(something) }
      cp {  assertAnotherThing  should be(anotehrThing) }

      cp.reportAll
    Foo
  }
ScalaTest offers a really useful feature called checkpoints, which enables multiple assertions to be performed within a test. Any failures are accumulated and reported together at the end of the test.
Using PageObjects in Tests
Now with our newly created Foo PageObject we can write tests like this:
/**
 * Test Using PageObject.
 *
 */
@Selenium
class MyFooTest extends FunSpecTestBase {
describe("Test using Foo PageObject") {
  it("should test stuff") {
         withFixture() { 
        fixture =>
            Foo
         .goFooUrl(fixture.url)
         .doSomethings(fixture.foo)
         .assertSomething
        }
      }
   }
}
We can also include additional PageObjects in tests:
/**
 * Test Using PageObject.
 *
 */
@Selenium
class MyFooTest extends FunSpecTestBase {
describe("Test using Foo PageObject") {
  it("should test stuff") {
         withFixture() { 
        fixture =>
            Foo
         .goFooUrl(fixture.url)
         .doSomethings(fixture.foo)
         .assertSomething

        Foo2         
         .clickSomeStuff
         .assertSomeStuff
        }
      }
    }
 }
And if Foo has an action getFoo2, with a return type of Foo2, we can chain actions together:

/**
 * Test Using PageObject.
 *
 */
@Selenium
class MyFooTest extends FunSpecTestBase {
describe("Test using Foo PageObject") {
  it("should test stuff") {
         withFixture() { 
        fixture =>
            Foo
         .goFooUrl(fixture.url)
         .doSomethings(fixture.foo)
         .assertSomething
         .getFoo2        
         .clickSomeStuff
         .assertSomeStuff
        }
      }
    }
 }

Take, for example, Gilt’s Sale Listing page:

The Sale Listing page serves several elements to users, such as breadcrumbs, sale end times, sale titles, and filters. Each Sale Listing page also features n product looks, also known as Listing Looks, that contain product names, brand names and prices. We can now logically abstract the Listing Look as a function or factor of the page. In other words, the Listing Look has a number of related elements and actions that are uniquely identifiable as belonging to a Listing Look. Each Listing Look can be its own PageObject and resolve to a Quick Add Modal, which in turn can resolve to a Cart modal based on user interactions.


As we can break down and describe the services on the page into unique, logical groupings, we can start to define PageObjects for the page. According to our team’s interpretation of PageObjects, we regard PageObjects not as an Object of the entire page, but rather as a number of easily defined services, elements, and actions that can be grouped together to model the page. With PageObjects broken down into these component parts, we can create PageObjects for each element.
For a Sale Listing page, we can have four PageObjects:
SaleListing -> ListingLook -> QuickAdd -> Cart
We can also have a CartItems PageObject, as a Cart can have n items (up to five user selections).
Show me some real code, dude!
At Gilt, we’ve set up a repository for our Sale Listing code. We’ve also created a Selenium folder that has its own project structure:


With this setup, we can export a PageObject listed under the src/main folder in web-search-selenium as its own jar, import it into another project, and use it in that project’s tests. To port tests from the repository to a global/integration regression, we tag a test so that it can be called and included from within an integration execution job. Let’s look at a test:
abstract class QuickAddToCartTestOnSaleListing extends FunSpecTestBase
  with SkuFixture
  with SaleHelper
  with BeforeAndAfterEach
{
  implicit val eventType = Synthetic

  override protected def beforeEach() { registerAUser() }
  override protected def afterEach() { logoutAndCloseBrowser }
  protected def skuFilter(sku: Sku): Boolean

  describe("Sale listing") {
    it("should add available sku to cart using quick add") {
      withActiveSku(filter = skuFilter, lock = true) { sku =>
          Given(s"a sku[$sku.getSkuId]")
          val sale = getSale(sku)
          val productLook = sku.getProductLook
          And(s"its sale[$sale.getSaleId]")
          Then("go to the sale listing")
          SaleListing
            .goToSaleListing(sale.getRelativeUrl
                .asScala
                .getOrElse(cancel("Sale did not have a relativeUrl")))
             //SaleListing action which returns a ListingLook PageObject. 
            .getListingLook(productLook.getProductLookId)

             //ListingLook rich action which selects a size and click add to cart. 
            .triggerQuickAdd

             //QuickAdd action which returns a Cart.
            .addToCart(sku.getSize.asScala.map(_.getLabel.toLowerCase))

             //Cart action which returns a CartItem.
            .getCartItem(sku.getSkuId)

             //CarItem Assertion
            .assertCartItem(sku.getProductLook.getProduct.getName,          
                            sku.getProductLook.getProduct.getBrand.getName)

          Cart.clearCart()
            .assertCartEmpty
            .assertContinueShoppingIsDisplayedWhenCartIsEmpty
      }
    }
  } 
Because the test steps are located in an abstract class, we can reuse the code to create brand-new tests and check other functionalities, based on the SKU and its attributes (which are passed into the test via the fixture).

/**
* Tests for Quick Add on Search-Listing Page
*/
@Selenium
class QuickAddToCartTestOnSaleListingSkuHasSize 
extends QuickAddToCartTestOnSaleListing
   with SearchHelper {
  
   //Use filters to find a specific sku to test with.
   override def skuFilter(sku: Sku): Boolean = 
               SkuFilters.hasSearchBaseFilters(sku) &&                           
               SkuFilters.hasSizeAttribute(sku) &&
               isOnFirstPageLoad(sku)
}

Let’s dig deeper:

            //ListingLook rich action which selects a size and click add to cart.
            .triggerQuickAdd

             //QuickAdd action which returns a Cart.
            .addToCart(sku.getSize.asScala.map(_.getLabel.toLowerCase))

             //Cart action which returns a CartItem.
            .getCartItem(sku.getSkuId)

.triggerQuickAdd. This action is a ListingLook Simple Action that performs a mouseEnter on a productName element Listing Look and returns a QuickAdd PageObject.
def locators = ListingLookLocators
def triggerQuickAdd()
(implicit eventType: EventType, driver: WebDriver): QuickAdd = {
        
      mouseEnter(locators.productName(this.productLookId))
    QuickAdd(productLookId)
  }
.mouseEnter
/**
   * Move Mouse into Element Position.
   *
   * @param query : WebBrowser#Query to define the webElement
   * @param eventType : Native or Synthetic
   */
  def mouseEnter(query: WebBrowser#Query)
     (implicit eventType: EventType, driver: WebDriver) {
      WaitTool.waitForElementIsDisplayed(query)
      eventType match {
          case Native => {
                 val builder = new Actions(driver)
                 builder.moveToElement(query.webElement).build().perform()
          }
          case Synthetic => JQueryHelper.mouseEnter(query)
    }
    JQueryHelper.pageIsLoadedAndAjaxIsCompleted()
  }

This action is located in our commons-selenium library and will execute a Selenium action or a jQuery action based on the eventType. This action is wrapped to perform:
- on enter : ensure the element is displayed
- on exit : ensure, all Ajax calls are completed and the DOM is in a readyState of “complete”.
.addToCart is a rich action comprised of a number of simple actions. It calls the Cart PageObject waitForCartDisplayed action, which returns a Cart PageObject:
/**
   * Selects (if necessary) the size and adds it to the cart, 
   * asserting that the cart opens successfully.
   */
  def addToCart(sizeOpt: Option[String])
      (implicit eventType: EventType, driver: WebDriver): Cart.type = {
    selectSize(sizeOpt)
    clickAddToCartButton()
    Cart.waitForCartDisplayed()
  }
.getCartItem(sku.getSkuId) is a Cart action that returns a CartItem PageObject based on the skuId. .assertCartItemDisplayed() and ensures that the CartItem is actually in the cart:

  def getCartItem(skuId: Long)
     (implicit eventType: EventType, driver: WebDriver): CartItem = {
    CartItem(skuId).assertCartItemDisplayed()
  }

A CartItem is a function of the Cart, so it is a PageObject, as you can have n items on a cart.
Wrap-up
With PageObjects, we’ve eliminated a lot of the flakiness associated with testing. Breaking PageObjects down into smaller logically grouped constituent parts works just as well for small projects as for bigger ones. And because we’re using BrowserAction and more of the wrapping, we can more easily follow our work flow from one step to the next. The motivation for this work is to drive more voluntary adoption of Selenium within teams at Gilt.

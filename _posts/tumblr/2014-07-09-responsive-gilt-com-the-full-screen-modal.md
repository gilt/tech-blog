---
layout: post
title: 'Responsive Gilt.com: The Full-Screen Modal'
date: '2014-07-09T12:43:00-04:00'
tags:
- Gilt
- Gilt Tech
- Gilt Groupe
- gilttech
- responsive design
- Kyle Dorman
- Gilt.com
- Gilt iPhone app
- full-screen modal
- filtering
- CSS
- Less.js
- responsive design series
- Special Operations
tumblr_url: http://tech.gilt.com/post/91263242344/responsive-gilt-com-the-full-screen-modal
---
In making Gilt.com responsive to the mobile device, the Special Ops team identified several responsive patterns that we relied upon to “responsivize” our site layout. Identifying these patterns early on helped us to more confidently make subsequent responsive-related decisions. For our fourth responsive-related blog post, I would like to share how we discovered and implemented one of our favorite design patterns that we identified: the full-screen modal.
The Gilt iPhone app was the primary source of responsive design inspiration for our team. One of our iPhone app’s strongest design elements is its full-screen view for filtering, which differs greatly from the filtering layout on Gilt.com where filtering exists as a set of dropdowns on the sale page and a sticky sidebar on the search page.
The app’s filtering:

Gilt.com’s filtering:

The full Gilt site’s filtering style fits well on both PC and tablet-sized screens, but is too large for mobile devices. This is one of the reasons our current mobile site (m.gilt.com) does not give users the filtering feature. With this in mind, our team emulated the Gilt iPhone app’s design by creating a full-screen view for filtering on mobile-sized screens. This pattern uses almost exclusively CSS (we use less.js) and therefore doesn’t add significant size to the pages’ payload.
Full-screen modal was simple to implement, so we decided to apply it in other places on the site–for example, in a product’s size chart. Here’s a JS Bin that demonstrates our implementation.
On narrow screens (a mobile device in landscape, for example) and tiny screens (a mobile device in portrait):
 Set the content’s wrapper element to
position: fixed
display: none
          by default, and set it to fit the entire screen
Add a call to action that’s visible only on narrow and tiny screens, and that, when clicked/touched, adds the class ‘content-open’ to either the content’s parent or to the content itself
Add CSS to display the content when the ‘content-open’ class is added
Add a no-scroll class to the body when the button is clicked that sets the whole page to
position: fixed
           this prevents the body from scrolling behind the open modal
Add a button/action in the open content modal which closes the content and returns the user to the full page
Special Ops believes that the best mobile user experiences permit users to focus on a page’s core content without being distracted by other features. With the full-screen modal, we abstracted away all the complexity of the filtering into a separate user experience and gave the abstracted feature the full-screen ‘real estate’ it deserves. Everything the user sees–a product, a list of products, etc.–is built around this simplified experience. Now that this pattern is well understood, we plan on continuing to use it in our future responsive design efforts.

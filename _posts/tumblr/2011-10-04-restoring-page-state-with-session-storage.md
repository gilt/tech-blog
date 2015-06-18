---
layout: post
title: Restoring Page State with Session Storage
date: '2011-10-04T16:07:09-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/11030244495/restoring-page-state-with-session-storage
---
Managing the back button on the web is hard, especially remembering the previous page’s state when the back button is used. Fragment identifiers can be a solution, and there are some great plugins out there which use that method. However, there’s only one URL fragment, so identifiers need to be carefully namespaced to avoid collisions and the fragment in the URL becomes detritus that affects bookmarking, along with looking unpleasant and confusing to the user.
On Gilt’s new site, Park & Bond, I wanted to stay away from fragment identifiers (/products/denim#color=blue), in keeping with Gilt’s commitment to forward-thinking front end engineering practices. We believe in progressive enhancement at Gilt, and I was able to make use of HTML5 sessionStorage to provide a better experience for our customers.
Though there is no way to know for absolutely certain, one way to know if a user has hit the back button is to configure caching correctly on the server, and then determine whether the browser is using cached HTML or a new page request. The HTTP 1.1 specification, section 13.13, states that a “history mechanism is meant to show exactly what the user saw at the time when the resource was retrieved.” Chrome and IE, and usually Firefox, behave basically the same in using cached HTML where it makes sense, and re-executing JavaScript. Firefox sometimes shows the last state of the page without executing script, so in that case it’s not necessary to do anything.
If a unique page token is added to the HTML of each page view, it is possible both to store information unique to that token and to use its value to determine whether the page has been viewed before. I use a data attribute on the HTML element to store this server-generated token.
I built a small JavaScript object called Gilt.pageToken to provide an API for storing values on a page token key using sessionStorage. Using the session, there’s little risk of overloading the browser’s storage limits and no way we will restore things we don’t want to restore if the user comes back the next day in a different browser tab. The API is simple:
Gilt.pageToken.get(''key'');
Gilt.pageToken.set(''key'', value);
The value can be anything; it is transformed into a sessionStorage string with JSON.stringify().
So, how is this useful?
The product listing page on Park & Bond allows continual scrolling, making additional ajax requests as the user goes down the page. If a user clicks on a product, goes to its detail page, and then goes back to the listing page, the user expects the page to restore its previous state, including any active facets and the scrolled-to additional products. However, the browser’s HTML cache will not have this information, since the page load included only the first set of products and facets.
So, when the user clicks a product, Gilt.pageToken is used to store the scroll position (as a vertical offset integer) and the query object that holds the facets which were active at the time of the click. When the user hits back, Gilt.pageToken looks up those values by the current page token key. If that key exists in sessionStorage and has values, those values are used to restore the page state.
The session storage pageToken object after a few page views might look something like this:

{
  "PT131741761614767":
  {
{% endhighlight %}
  },

  "PT1317417630680593":
  {
{% endhighlight %}
  },

  "PT131741766597481":
  {
{% highlight python %}
"filterState":
{
  "key":"color",
  "value":"Black",
  "offset":518.4000244140625,
  "top":0
},
"swayzeScrollPosition":503,
"lastQuery":
{
  "category":"clothing",
  "subcategory":"denim",
  "start":0,
  "count":24,
  "occasion_pnb":"drinks-with-friends",
  "color":"Black"
},
{% endhighlight %}
  }
}

Of course, this depends on browsers behaving as expected and choosing not to re-request HTML when the user hits the back button. Currently Chrome and IE (without the developer request-every-view setting and with cache-control headers configured correctly) follow this behavior. Firefox in some cases follows this behavior and in other cases restores the page state from memory, choosing not to execute any JS at all, so the page already “remembers” its filters and has all the products loaded. IE7 does not support sessionStorage at all, so it misses out on this functionality, but all modern browsers are able to fully restore the state. 
We also make use of this in the product slideshow, so users can go to the detail page for any of the products and not lose their place when they return to the slideshow page via the back button.
We will keep watching browsers to make sure they follow the spec and this solution continues to be functional. It’s a workaround, one that requires cooperation from the server and browsers with reference to page caching, but one that dramatically improves the user experience without using fragment identifiers in the URL.

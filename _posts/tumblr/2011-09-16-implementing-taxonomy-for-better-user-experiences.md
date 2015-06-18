---
layout: post
title: Implementing Taxonomy for Better User Experiences
date: '2011-09-16T16:11:00-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/10285583910/implementing-taxonomy-for-better-user-experiences
---
by Amy DeCicco, Taxonomist and Steve O’Brien, Sr. Software Engineer
Halston, We Have a ProblemLike most rapidly growing start ups, product classification at Gilt Groupe was not fully formed at the outset. Initially, products were tagged with keywords, and those keywords were user-defined and free-form. One person’s “shoes” was another person’s “lace-ups” was another person’s “monkstraps,” and as a result it became increasingly more difficult to assess inventory by category of product. Additionally, as inventory grew and there was a need to surface product categories on gilt.com to help shoppers navigate through sales, this method of classifying and organizing products became rapidly untenable. In response to this problem, around a year ago Gilt introduced a more structured 2000-term “product hierarchy” for merchandising specialists to index their inventory, a component of which was to attach a “pretty name” or short label to each product category for front-end category navigation. This structured classification was a step in the right direction, and improved inventory reporting, but it wasn’t the best solution for creating intuitive user experiences for shoppers on gilt.com. Two thousand very specific categories were too granular for the number of products typically featured in a sale. In addition, categories were not hierarchical, mutually exclusive, unique, contextual, or even very illustrative. As a result, Gilt’s site filter tools were often imprecise, created user confusion, and fostered suboptimal user experiences.

Redundancy & lack of meaning in drop downs

Category filtering without context - “coffee table, crewneck, download, earrings”
Gilt needed a way to negotiate between the very specific product categories used by the Merchandising and Planning teams to analyze their business and what the shopper saw in category navigation. We needed to build a taxonomy tool and the back-end database infrastructure to support it. Taxonomy (Not Taxidermy) Taxonomy is a method of organizing categories of content on a website. Taxonomies are built to help you navigate through content  in top and left nav experiences all over the web. Taxonomy is hierarchical, that is, taxonomies are made up of a root and multiple category levels which have parent-child and sibling relationships.

An e-commerce taxonomy
Gilt’s taxonomy needed to support navigation through product categories and subcategories in men’s, women’s, and children’s apparel and accessories, as well as home goods and gifts sales, and support attributes for additional navigational filtering.
Taxonomy Model
At Gilt the taxonomy tool functions as the bridge between the merchandizing departments’ product categories and the web taxonomy you see on Gilt.com. The tool is also the management system for front-end category creation/management. Gilt’s taxonomy tool allows for multiple taxonomies (separate roots for Gilt.com, Gilt Taste, Park & Bond, et al) as well as attributes. It supports taxonomy scheduling and publishing, importing, exporting, and copying. It supports 1:1, 1:many, and many:1 relationships between back-end product categories and the shopping categories users see on the site. For the Gilt site we mapped over 2000 back-end categories to 140 user-intuitive front-end categories.All products in Gilt’s businesses belong to one of the above-mentioned internal product categories. These categories take into account separate business units and important distinctions between types of products as well as divvy up different kinds of products by type. These categories are mostly hidden from the customer when mapped to the user-friendly taxonomy shown on the site.

The taxonomy management tool links front-end taxonomy with back-end product categories. 
Product categories can be mapped to more than one node in the taxonomy.  For example, our merchandisers classify some kid’s apparel as appropriate for both boys and girls as “unisex apparel.” In a filter tool, we want those unisex products to appear in both girls’ and boys’ filter selections. Taxonomies cannot be changed once published; A published taxonomy is cloned, and any changes go into a “draft” taxonomy until it is published and overrides the older one. Every taxonomy has a “live” date and time, so it can be made active at an exact  moment. Each previously published taxonomy is archived and serves as a historical audit trail.In addition to taxonomy functionality, we built the ability to associate attribute types and values to categories. Attributes describe a characteristic of a product. We can create attribute sets and their values in the taxonomy manager, and associate them to parts of a taxonomy or the entire taxonomy.

Attribute sets applied to the root-level node of the Gilt Taste taxonomy
We use product attributes on the front end to provide users with visible options for clarifying and refining their browsing experience. This is referred to as “faceting” and can be used to apply criteria further drill down into a product listing.
“Trends” is an attribute set that is applied to products to create collections on Gilt’s Park and Bond site. Taxonomy in ActionThe taxonomy we build in the taxonomy management tool appears in filtering on sale pages on Gilt.com.Taxonomy creates context between categories through hierarchy.
On the Park & Bond site, the current live taxonomy is also visible: it drives the navigation bar that’s present throughout the site, as well as category landing pages.
Each heading and its subcategories in the top nav are pulled from the taxonomy management tool. 
ResultsWe began surfacing front-end categories to members gradually, and conducted A/B testing to measure whether add to cart and conversion improved. Today all members see the categories.  The categories are
Multi-select
Hierarchical & contextual
Simplified
We saw an improvement in cart add and conversion that coincided with the redesigned pages and introduction of taxonomy on the Gilt sites. We also heard positive feedback from our customer feedback system. In addition, the before and after screen grabs like the examples below tell a compelling story.  A gifts sale before taxonomy implementation

A gifts sale after taxonomy implementation

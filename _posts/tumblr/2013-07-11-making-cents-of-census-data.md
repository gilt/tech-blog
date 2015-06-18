---
layout: post
title: Making Cents of Census Data
date: '2013-07-11T18:19:00-04:00'
tags:
- census
- open data
- American Community Survey
- demographics
- data engineering
- mdb-tools
- gilt
- gilttech
- Gilt Data
- Elon Azoulay
- U.S. Census
- US Census
- aggregating US Census data
- open source
- demographic information
- tools
- data
tumblr_url: http://tech.gilt.com/post/55205886124/making-cents-of-census-data
---


If you work in data science, you’ve probably come across websites that present U.S. Census data with fancy bells and whistles (such as associated maps) that you can use to find demographic information. These websites, which usually charge a fee, often allow you to look up limited amounts of data–and typically one zip code at a time.
As proponents of open source, we’ve decided to skip the fees and share, for free, this easy-to-use file that aggregates 2010 U.S. Census data and 2007-2011 American Community Survey data, aggregated to the zip code level.
Parsing and aggregating the data into something digestible was an excruciating process, but I’m glad I did it. At Gilt we aggregate data at the ZIP code level to better understand the demographic profile of our customers. The above table helps us gain insights into the general demographic profile of the areas of high and low customer membership/activity. For example, we can compare membership and order conversion in rural vs. urban areas, or differentiate purchasing and web behavior in high vs. low income areas. I say “general” because the data is aggregated to the postal code level, it’s not about a specific individual.
I was warned
As a database administrator and data engineer, I occasionally receive interesting data-related requests from my colleagues. One of the more interesting inquiries I’ve fielded recently came from one of Team Data’s very own–Data Scientist Igor Elbert. Igor’s known to pepper his own data analyses with references to Russian literature and World War II history, so I wasn’t totally surprised that his request was a bit on the exciting and creative side (as far as data requests go).
I was warned that Igor’s request might be a bit tedious to fulfill. Yet it seemed simple enough (just three steps!):
parse the census data
import it into Gilt’s data warehouse and
aggregate the data by zip code in order to better visualize the demographic information about our customer base.
I did not heed the warning, and enthusiastically dove into the world of U.S. government data. This process turned out to be far more complex and interesting than I initially thought it would be, and also involved importing the subset of American Community Survey (ACS) data about people’s economic status, education level, and house value. The census data was only available in an archaic–i.e., end-of-the-20th-century–format. Column names corresponded to lookup values. Tables were embedded tables within tables, differentiated with a “table” column. To find what I was looking for required an additional lookup of the attribute associated with each value.
Processing the Data
In order to find out what kinds of data the columns represented, I had two options:
Extract the data from a giant PDF “tech-doc” file that comes with the Census and ACS
Use the provided Microsoft Access data shells (of course I do not, nor will I ever, have a copy of Microsoft Access). An alternative to using Access is mdb-tools.
I chose option #2, since this could be automated. It’s both humorous and sad that the U.S. Census Bureau still presents its data using MS Access and MS Excel instead of an open source database or some other format. New York City and other governmental bodies around the world make their data available in more modern and open formats, yet the federal government apparently can’t let go of its pre-Y2K technologies. Access still enforces a 255-column limit-per-table restriction on files, which for my purposes resulted in about 290 segmented files per state. I used mostly Perl and some Scala to automate parsing of these files into Aster Database/PostgreSQL-compatible SQL and data files.
Here’s where things got interesting: After parsing all of that poorly presented census data, I discovered that it contained a wealth of information that can be correlated to find out more about Gilt’s customer base–and how we can better target our marketing to reach them. The census data includes a geographic information lookup table that provides information on state, county, Combined Statistical Area (CBSA) and aggregation or summary level (the geographic level the data represents–for example, state, county, county/sub-county, or zip code):

Column   |       Type        | Modifiers 
-----------+-------------------+-----------
 FILEID    | character varying | 
 STUSAB    | character varying | 
 SUMLEVEL  | character varying | 
 COMPONENT | character varying | 
 LOGRECNO  | character varying | 
 US        | character varying | 
 REGION    | character varying | 
 DIVISION  | character varying | 
 STATECE   | character varying | 
 STATE     | character varying | 
 COUNTY    | character varying | 
...
...
...

Here is an example of the lookup data for household income (the long table title corresponds to the table segment ‘0056’ and the subtable ‘B19001’):


 Table ID | Segment File | Column |                                                                   Long Table Title                                                                   
----------+--------------+--------+------------------------------------------------------------------------------------------------------------------------------------------------------
 B19001   | 0056         | .      | HOUSEHOLD INCOME IN THE PAST 12 MONTHS (IN 2011 INFLATION-ADJUSTED DOLLARS)
 B19001   | 0056         | .      | Universe:  Households
 B19001   | 0056         | 1      | Total:
 B19001   | 0056         | 2      | Less than $10,000
 B19001   | 0056         | 3      | $10,000 to $14,999
 B19001   | 0056         | 4      | $15,000 to $19,999
 B19001   | 0056         | 5      | $20,000 to $24,999
 B19001   | 0056         | 6      | $25,000 to $29,999
 B19001   | 0056         | 7      | $30,000 to $34,999
 B19001   | 0056         | 8      | $35,000 to $39,999
 B19001   | 0056         | 9      | $40,000 to $44,999
 B19001   | 0056         | 10     | $45,000 to $49,999
 B19001   | 0056         | 11     | $50,000 to $59,999
 B19001   | 0056         | 12     | $60,000 to $74,999
 B19001   | 0056         | 13     | $75,000 to $99,999
 B19001   | 0056         | 14     | $100,000 to $124,999
 B19001   | 0056         | 15     | $125,000 to $149,999
 B19001   | 0056         | 16     | $150,000 to $199,999
 B19001   | 0056         | 17     | $200,000 or more
...
...

Then a corresponding select from table segment ‘0056’ (all table segments had to have their data definition language reverse-engineered using the above lookup data as well–for example, table ‘B19001’ column 13 indicates the number of people in the $75-100K income bracket):

  Column   |       Type        | Modifiers 
------------+-------------------+-----------
 FILEID     | character varying | 
 FILETYPE   | character varying | 
 STUSAB     | character varying | 
 CHARITER   | character varying | 
 SEQUENCE   | character varying | 
 LOGRECNO   | character varying | 
 B19001_1   | character varying | 
 B19001_2   | character varying | 
 B19001_3   | character varying | 
 B19001_4   | character varying | 
 B19001_5   | character varying | 
 B19001_6   | character varying | 
 B19001_7   | character varying | 
 B19001_8   | character varying | 
 B19001_9   | character varying | 
 B19001_10  | character varying | 
 B19001_11  | character varying | 
 B19001_12  | character varying | 
 B19001_13  | character varying | 
...
...
COUNTY | COUSUB | CBSA  | median_household_income 
----------+--------+--------+--------+-------+-------------------------
 0020416  | ny     | 047    |        |       | 99938
 0009268  | ny     | 103    | 10000  |       | 99926
 0007581  | ny     | 071    | 47999  |       | 99911
 0025098  | ny     | 071    |        |       | 99911
 0001616  | ny     | 029    | 24130  |       | 99911
 0030562  | ny     | 119    |        |       | 99904
 0028569  | ny     | 103    |        |       | 99904

With our Census/ACS data file, you can conduct highly complex demographic analyses without having to waste lots of time looking up the same information zip code by zip code. Use it to gain better insights by region, population density, income level, education level, house value, and more.
Photo by  Brian Kelley. License via Creative Commons.

---
layout: post
title: Importing Google Trends data
date: '2015-05-11T13:26:01-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/118707584199/importing-google-trends-data
---
Google Trends offers a trove of data for analysis. It’s not used nearly enough partially because good folks at Google did not provide an API to access the data. You can play with Trends in you browser, embed it into your webpages but it’s not that simple to get the raw data behind it to use it in your analysis.There is a number of packages in Python, Perl, or R that pull the data for you but none of them did when I needed: compare hundreds of trends against each other.You see, not contend with the lack of API Google returns trends on 1 to 100 scale so it’s hard to compare numbers for many different trends. You can plot several trends on the same graph but you will not be able to tell how they stand relative to another set of trends.For example:Above: “Game of Thrones” vs. “House of Cards”.Below: “Orange is New Black” vs. “The Newsroom” Since each set is rescaled there is no way to tell how “House…” stands against “Orange…” I needed to get the trends for hundreds of fashion brands Gilt deals with and compare them against each other.The logical solution seemed to use one search term as a baseline in every set and then rescale the results relative to a baseline term.I borrowed heavily from GTrendsR package and came up with a script in R that pulls trends and rescales them relative to baseline.It took some hacking: I took Google Trends export link that looks something likewww.google.com/trends/embed.js?hl=en-US&q=/m/06bkdx,+/m/0tlwzvq,+/m/0b6hm_f,+/m/0c5_m3,+/m/0f4w93&geo=US&date=2/2013+25m&cmpt=q&tz&tz&content=1&cid=TIMESERIES_GRAPH_0&export=5and after looking at various export options found the one (export=3) that returns raw data in JSON-like string. For example:http://www.google.com/trends/fetchComponent?q=%2Fm%2F06bkdx%2C%2Fm%2F0624dh&date=today%207-d&geo=US&cat=0-18&cid=TIMESERIES_GRAPH_0&export=3returns:// Data table response
google.visualization.Query.setResponse(
{"version":"0.6","status":"ok","sig":"881376537",
"table":{"cols":[
 {"id":"date","label":"Date","type":"date","pattern":""},
 {"id":"query0","label":"Agent Provocateur","type":"number","pattern":""},
 {"id":"query1","label":"Kate Spade","type":"number","pattern":""}
],
"rows":[{"c":[
 {"v":new Date(2015,3,18),"f":"Saturday, April 18, 2015"},
 {"v":0.0,"f":"0"},{"v":77.0,"f":"77"}
]},
{"c":[
 {"v":new Date(2015,3,19),"f":"Sunday, April 19, 2015"},
 {"v":0.0,"f":"0"},{"v":100.0,"f":"100"}
]},
{"c":[
 {"v":new Date(2015,3,20),"f":"Monday, April 20, 2015"},
 {"v":0.0,"f":"0"},
 {"v":65.0,"f":"65"}]},
{"c":[
 {"v":new Date(2015,3,21),"f":"Tuesday, April 21, 2015"},
 {"v":0.0,"f":"0"},{"v":62.0,"f":"62"}
]},
{"c":[
 {"v":new Date(2015,3,22),"f":"Wednesday, April 22, 2015"},
 {"v":0.0,"f":"0"},{"v":57.0,"f":"57"}
]},
{"c":[
 {"v":new Date(2015,3,23),"f":"Thursday, April 23, 2015"},
 ,
 {"v":null}
]},{"c":[
 {"v":new Date(2015,3,24),"f":"Friday, April 24, 2015"},
 ,
 {"v":null}
]}]}});Which is turned into a valid JSON with 4 lines of R code and then parsed into R data structures with rjson package.The result looks like:And can now be analyzed, plotted, and joined with other data.Because of the powers of SQL/MapReduce in our Teradata Aster database we can pull the trends and join with our relational data on the fly in SQL:SELECT *FROM STREAM (       ON (SELECT brand_name from dim_brands)       PARTITION BY brand_name       SCRIPT(‘GTrends_MR.R’)       OUTPUTS(''week DATE, term VARCHAR, trend INTEGER’))Any comments on Google Trends, R style and overall approach are appreciated.Happy trending!

---
layout: post
title: Working with Time Series Data
date: '2013-04-08T12:08:00-04:00'
tags: []
tumblr_url: http://tech.gilt.com/post/47462339043/working-with-time-series-data
---
Life in Gilt Tech involves much lively discussion on KPIs, consequently we spend a lot of time looking at time series data.

We use a variety of tools to manipulate and present this type of data, including R, a language and environment for statistical computing and graphics.
To help us through the process of standardizing the way we represent our KPIs we have developed a simple, R based open-source utility for easily representing time series data originating from a variety of sources.

If you think you might find this useful, or you’d like to contribute, check out the time series project on github, and the examples below.
 
Example: a thumbnail showing acme revenue by time:

plot_time_series --width=500 --height=400 --x_spacing="2 months" --csv_filename=test_data/acme_revenue.csv --point_color=gray80 --sunday_point_color=gray80  --remove_outliers --smoothness=0.8 --y_line="35000:Target" --y_prefix="$"

Example: the same revenue data shown in more detail

plot_time_series --width=1200 --height=700 --x_spacing=week --csv_filename=test_data/acme_revenue.csv --title="Acme Revenue: %s to %s" --remove_outliers --y_line="25000:Target for 2012:gold3!36000:Target for 2013:gold2!42000:Target for 2014:gold1" --y_prefix="$"



More plot time series examples and documentation …

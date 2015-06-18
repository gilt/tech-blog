---
layout: post
title: 'Old Browsers in eCommerce: What to do with IE6?'
date: '2012-02-07T21:34:00-05:00'
tags: []
tumblr_url: http://tech.gilt.com/post/17243913074/old-browsers-in-ecommerce-what-to-do-with-ie6
---
In a humanitarian effort to improve developer quality of life, we at Gilt recently stopped supporting Internet Explorer 6. This means we no longer use, develop or test for the browser. Given the small and shrinking population of IE6 users and the auto-upgrades planned for this year, we felt that it is worth our developers’ happiness (and sanity) to abandon support efforts. Our FEET (Front End Engineering Team) are certainly happy to let go of ’[if IE 6]’ conditional comment hackery and other ugly shoehorning techniques.
We found ourselves wondering… Would IE6 users have a better shopping experience if we redirected them to the minimalistic mobile version of gilt.com? Could the simple no frills layout designed for mobile devices just might be an improvement over the fully-featured yet unsupported site for IE6 users? Let’s walk through the exercise of answering this question, from data collection to results summarization.
Split Testing
Most often the best way to answer a question is with an experiment. In the context of Gilt and e-commerce, we find split testing to be an effective method for assessing the effect of changes (treatments) to the user shopping experience, be it the reorganization of a sale page or a modification to our checkout flow. Controlled split tests allow us to gauge the impact on our KPIs with statistical confidence, relying less on opinion and more on evidence-based reasoning.
The idea is to separate a representative subset of the user-base to expose the change to and assess the effects of the change on this smaller group before making the decision to roll out to all visitors. This ‘test’ subset should be paired with a mutually exclusive ''control’ subset. Both subsets should be randomly sampled such that they are characteristically the same as each other. We may or may not choose to limit the testing to a segment of our users. For instance, we may want to limit the test to NY members, in which case our ''test’ and ''control’ groups should only be chosen from members in the NY population. 
Comparing Conversion Rates
If the redirect has any notable effect on the user experience, it should show in the proportion of buyers-to-visitors, a.k.a. ''visitor conversion rate’. Conversion rates are proportions and from a statistical point of view are quite easy to work with. We will be comparing the conversion rate of a ''Test’ group that sees the mobile site to a ''Control’ group that sees the regular site. For sake of brevity, I will not go into detail about the nuances of measuring our numerous other site metrics (revenue, dwell time, drop-off… etc.) and test scenarios (multi-variate, overlapping, longitudinal… etc.).
On a high-level, we want to accomplish the following steps:
Segment out our IE6 visitors - our ''IE6 base’.
Randomly sample a representative test group from the IE6 base and redirect them to m.gilt.com.
Measure the difference in ''visitor conversion’ between the test group and the remainder of the IE6 base (control).
Test or control group membership is tracked via a randomly assigned ''partition’ number (integer) that is issued on first visit in a cookie and persisted thereafter in our operational database. We can then redirect IE6 users to m.gilt.com based on the partition they have and whether the user-agent string indicates they are running IE6. The mobile version of our site is very lean and lacks javascript tagging for tracking site interactions. As a result, we will need to fall back to some good old ad-hoc data munging from our server logs and match up against our OLTP database to piece together the conversion rates per group.
We can segment out IE6 visits quite easily by checking the GET request user-agent string in our server logs. The string should contain ''MSIE 6.0’.
Example user-agent string: ’Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)’. 
Splunk is a great tool for efficiently parsing and aggregating statistics from log files. We can use it find unique IE6 visitors by day (our IE6 base group) with the following query:
Splunk query 1 (output filename: all_ie6_users.csv):
host="olb*" guid "compatible; MSIE 6.0" | stats count by guid, date_mday, date_month

Half of these users belong to our test group and were randomly sectioned out and redirected to mobile. For this test we added logging to allow us to find those visitors from the test group that were redirected with the search string ''IE6 mobile redirect’.
Splunk query 2 (output filename: test_ie6_users.csv):
host="olb*" guid "IE6 mobile redirect" | stats count by guid, date_mday, date_month

Note: “olb*” limits the search to our public facing load balancers that are taking care of the redirection and ''guid’ is a unique identifier for each user.
The flat-files returned by Splunk are structured like so:
 guid             | month_day |  month   |  count  
------------------+-----------+----------+---------
 00e020bc-ccc8... |         3 | december |      35
 00ea4710-5be5... |         2 | december |      12
 0123d860-34aa... |         1 | december |       8

The results of these queries tell us who belongs in our test and control groups and when they visited. Users from Query 2 are ''Test’ and users from Query 1 that were not also in Query 2 are ''Control’. At this point I will move these files into temporary tables on a copy of our Postgres transactional database.
create temp table all_ie6_users (guid varchar(500), month_day integer, month varchar(50), count integer); 
\copy all_ie6_users from all_ie6_users.csv with delimiter '','' csv header 
create temp table test_ie6_users (guid varchar(500), month_day integer, month varchar(50), count integer);
\copy test_ie6_users from test_ie6_users.csv with delimiter '','' csv header

These two tables can be combined to produce one recordset, with a label for ''Test’ or ''Control’ and a standard date timestamp.
create temp table labeled_ie6_users as
select
  date(all_ie6_users.month || '' '' || all_ie6_users.month_day || '', 2011'') as day_timestamp,
  (case when test_ie6_users.guid is null then ''Control'' else ''Test'' end) as test_group,
  all_ie6_users.guid
from all_ie6_users left join test_ie6_users
  on all_ie6_users.guid = test_ie6_users.guid
  and all_ie6_users.month_day = test_ie6_users.month_day
  and all_ie6_users.month = test_ie6_users.month;

select * from labeled_ie6_users limit 3;
 test_group |    day_timestamp    | guid             
------------+---------------------+------------------
 Test       | 2011-12-01 00:00:00 | 00e020bc-ccc8... 
 Control    | 2011-12-02 00:00:00 | 00ea4710-5be5... 
 Control    | 2011-12-02 00:00:00 | 0123d860-34aa... 

Our ingredients in place, we can now calculate conversion rates per group by cross-referencing the guids and dates with our transaction records and counting unique buyers and visitors per day. These daily counts are then aggregated into a final ''Daily Visitor Conversion Rate’ per test group. Note, a visitor/buyer is only counted once per day even if they visit/purchase multiple times, a bit of precision lost because we lack mobile site page view data.
 test_group | buyers | visitors | conversion_rate
------------+--------+----------+-------------------
 Test       | 1154   | 36794    | .03136381
 Control    | 1749   | 47275    | .0369963

Basis Point Difference: (.03136381 - .0369963) = -0.00563249
% Lift, Test over Control: -0.00563249/.0369963 = -0.1522447 = -15.22%

The ’% Lift’ value is what we really care about. It tells us that 15.22% fewer daily visitors from the test group made a purchase relative to the control group.
Do we trust that this difference has anything to do with the redirect treatment? How do we know that it is not just random noise?
We can calculate a ''95% confidence interval’ to quantify a range where the ''real’ difference in conversion is likely to be. A confidence interval provides us with a lower and upper bound on where we would expect the difference in conversion rate to fall if we continued the test indefinitely. The more evidence (data) we have, the narrower the confidence interval. The width of the interval is a function of the size of our sample (# visitors) and the magnitude of the absolute difference between our test and control proportions (Lift %). With a larger sample and/or absolute difference, we get a tighter range. For example, a 10% difference between two samples of 10M observations will have a much narrower interval than a 1% difference between two samples of 100 observations.
Calculating a 95% Confidence Interval
R is an open source statistical computing language (technically a dialect of S-Plus) with a robust collection of libraries. Below is some R code for producing confidence limits around the difference of two proportions. We make use of the handy prop.test() (Proportions Test) function for the heavy lifting in our calculation.
test_numerator <- 1154
test_denominator <- 36794
ctrl_numerator <- 1749
ctrl_denominator <- 47275
test_rate = test_numerator/test_denominator
ctrl_rate = ctrl_numerator/ctrl_denominator


model <- prop.test(x=c(as.numeric(test_numerator),as.numeric(ctrl_numerator)), n=c(as.numeric(test_denominator),as.numeric(ctrl_denominator)), conf.level = .95, correct=F)

model_coef <- (model$estimate[1] - model$estimate[2]) / model$estimate[2]

prop_results <-
  data.frame(
   test_value = test_rate,
   ctrl_value = ctrl_rate,
   test_lift = model_coef,
   conf_int_low = model$conf.int[1]/model$estimate[2],
   conf_int_hi = model$conf.int[2]/model$estimate[2],
   row.names = NULL
 )

> prop_results
  test_value ctrl_value  test_lift conf_int_low conf_int_hi
1 0.03136381  0.0369963 -0.1522447   -0.2194746 -0.08501468

Final Results:

{% endhighlight %}
  Control Visitor Conversion Rate:  3.7% (1749/47275)
{% endhighlight %}
Test Lift 95% Confidence Interval:  [-21.947% to -8.501%]



Based on the results, we can be fairly certain that IE6 users redirected to our mobile site buy less often. 8.5% - 22% fewer visitors make a purchase if pointed to the mobile site. In stats lingo, our result is ''significant’ at 95% confidence because 0 is not between -.22 and -.085. In other words, we are 95% confident that the difference between test and control is not positive. If you remember p-values from statistics 101, a 95% confidence interval that does not include 0 is equivalent to a p-value < 0.05. Not only can we say the effect is significantly negative but we can also speak to just how negative the effect is, which is lacking in the typical NHST approach to testing which gives you a yes/no indication of difference rather than a magnitude.
Keep in mind, there’s no free lunch and intepretting results can be tricky. A counterintuitive result may leave you with more unanswered questions than you started with and ''significant’ does not necessarily mean ''important’ if the magnitude is trivial. Nonetheless, doing the work of interpreting the data is a worthwhile learning experience and a robust split testing methodology is an invaluable tool for decision making. When working in teams, everyone has an opinion but as the statistician W. Edwards Deming is often quoted, “In God we trust; all others must bring data.”
Read on for more detail on how the proportions test works with sample code…

Now you may be wondering what exactly is going on behind the scenes for the prop.test() function to produce our confidence interval. The calculation is fairly straightforward and can be implemented in virtually any language capable of simple math.
Components:
Z-score = 1.96 for 95% confidence (if significance is being calculated repeatedly, you will want to correct for multiple comparisons with something like a Bonferroni correction) 
Test Numerator = #buyers from the test group
Test Denominator = #visitors from the test group
Control Numerator = #buyers from the control group
Control Denominator = #visitors from the control group
Here is a decomposition of what the prop.test() is doing in R, borrowed from the source code and simplified for our use case:
  test_numerator <- 1154
  test_denominator <- 36794
  ctrl_numerator <- 1749
  ctrl_denominator <- 47275
  test_rate = test_numerator/test_denominator
  ctrl_rate = ctrl_numerator/ctrl_denominator

  x=c(as.numeric(test_numerator),as.numeric(ctrl_numerator))
  n=c(as.numeric(test_denominator),as.numeric(ctrl_denominator))
  conf.level = .95
  zscore = qnorm((1 + conf.level)/2)

  estimate <- x/n

  DELTA <- estimate[1L] - estimate[2L]
  WIDTH <- zscore * sqrt(sum(estimate * (1 - estimate)/n)) + 0 * sum(1/n)
  conf.int <- c(max(DELTA - WIDTH, -1), min(DELTA + WIDTH, 1))

  model_coef <- (estimate[1] - estimate[2]) / estimate[2]

  prop_results <-
{% highlight python %}
  test_value = test_rate,
  ctrl_value = ctrl_rate,
  test_lift = model_coef,
  conf_int_low = conf.int[1]/estimate[2],
  conf_int_hi = conf.int[2]/estimate[2],
  row.names = NULL
{% endhighlight %}

> prop_results
  test_value ctrl_value  test_lift conf_int_low conf_int_hi
1 0.03136381  0.0369963 -0.1522447   -0.2194746 -0.08501468

Ported to Java (using Apache Commons Math):
import org.apache.commons.math.MathException;
import org.apache.commons.math.distribution.NormalDistribution;
import org.apache.commons.math.distribution.NormalDistributionImpl;
...

long test_numerator = 1154;
long test_denominator = 36794;
long ctrl_numerator = 1749;
long ctrl_denominator = 47275;

double confidence = .95;

double test_rate = new Long(test_numerator).doubleValue()/ new Long(test_denominator).doubleValue();
double test_std = test_rate*(1-test_rate)/ new Long(test_denominator).doubleValue();

double ctrl_rate = new Long(ctrl_numerator).doubleValue()/ new Long(ctrl_denominator).doubleValue();
double ctrl_std = ctrl_rate*(1-ctrl_rate)/ctrl_denominator;

double delta = test_rate - ctrl_rate;
double test_lift = delta/ctrl_rate;
double conf_plus_one = confidence + 1;

try {
	NormalDistribution n = new NormalDistributionImpl();
	double qwidth = n.inverseCumulativeProbability(conf_plus_one/2);
	double width = qwidth*Math.sqrt(ctrl_std+test_std);
	double conf_int_low = Math.max(delta - width,-1)/ctrl_rate;
	double conf_int_hi = Math.min(delta + width,1)/ctrl_rate;

} catch (IllegalArgumentException e) {
	e.printStackTrace();
} catch (MathException e) {
	e.printStackTrace();
}

...

And Postgres SQL (not for the faint of heart!):
\set test_numerator 1154::float
\set test_denominator 36794::float
\set ctrl_numerator 1749::float
\set ctrl_denominator 47275::float

select
  :test_numerator/:test_denominator as test_value,
  :ctrl_numerator/:ctrl_denominator as ctrl_value,
  ((:test_numerator/:test_denominator) - (:ctrl_numerator/:ctrl_denominator))/
  (:ctrl_numerator/:ctrl_denominator) as test_lift,
  greatest(
    (:test_numerator/:test_denominator) - (:ctrl_numerator/:ctrl_denominator)
      - (
        -- z-score for 95% CI
        1.959964*sqrt(
          (
            (:test_numerator/:test_denominator)
              *(1-(:test_numerator/:test_denominator))/
                :test_denominator
          ) + (
            (:ctrl_numerator/:ctrl_denominator)
              *(1-(:ctrl_numerator/:ctrl_denominator))/
                :ctrl_denominator
          )
        )
      )
  ,-1)/(:ctrl_numerator/:ctrl_denominator) as conf_int_low_95,
  least(
    (:test_numerator/:test_denominator) - (:ctrl_numerator/:ctrl_denominator)
      + (
        -- z-score for 95% CI
        1.959964*sqrt(
          (
            (:test_numerator/:test_denominator)
              *(1-(:test_numerator/:test_denominator))/
                :test_denominator
          ) + (
            (:ctrl_numerator/:ctrl_denominator)
              *(1-(:ctrl_numerator/:ctrl_denominator))/
                :ctrl_denominator
          )
        )
      )
  ,1)/(:ctrl_numerator/:ctrl_denominator) as conf_int_hi_95;

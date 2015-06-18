---
layout: post
title: 'PostgreSQL: Query Catalog to Find Primary Key Columns'
date: '2014-12-04T11:02:00-05:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- PostgreSQL
- Postgres
- databases
- open source
- Michael Bryzek
tumblr_url: http://tech.gilt.com/post/104333115349/postgresql-query-catalog-to-find-primary-key
---


This week our team needed to get an ordered list of the columns that made up the primary key for a given table from PostgreSQL. Seemed simple enough. But we found a lot of different queries that gave partial answers–some of them incredibly complicated!
Here’s the query we ultimately put together:
select key_column_usage.column_name
  from information_schema.table_constraints
  join information_schema.key_column_usage
{% highlight python %}
  and key_column_usage.table_schema = table_constraints.table_schema
{% endhighlight %}
 where table_constraints.constraint_type = ''PRIMARY KEY''
   and table_constraints.table_schema = ?
   and table_constraints.table_name = ?
 order by coalesce(key_column_usage.position_in_unique_constraint, 0),
{% highlight python %}
{% endhighlight %}

As an example, given the following table:
create table users (
  id      bigserial primary key,
  email   text not null
);

Executing the query above with table_schema = ‘public’ and table_name = ''users’ results in:
column_name 
-------------
 id

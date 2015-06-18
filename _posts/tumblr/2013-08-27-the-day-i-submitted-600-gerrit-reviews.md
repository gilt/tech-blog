---
layout: post
title: The Day I Submitted 600 Gerrit Reviews
date: '2013-08-27T18:14:00-04:00'
tags:
- git
- gerrit
- microservices
- losa
- code review
tumblr_url: http://tech.gilt.com/post/59524548989/the-day-i-submitted-600-gerrit-reviews
---
It’s well known that code review is an important tool for improving quality, and we use Gerrit extensively at Gilt for that purpose. But there are also some less obvious benefits of such tools.
With a system composed of hundreds of small services, applications, database schemas, libraries, and toolsets–each hosted in its own Git repository–maintaining certain standards across all of them is essential, but challenging. We may want to ensure that a certain configuration or other metadata is provided by each repo, for example. Or we might want to strongly encourage application developers to update a core library. Our tools for bootstrapping a new repository help us to make sure that current standards are followed, but it’s easy for existing repositories to get out of date.
This is where Gerrit comes in: it becomes possible to run scripts against all of our repositories that propose a change of this sort then submit it to the owners of the repository to review. It would be irresponsible to blindly make such automated changes to all of our systems, and one individual can’t realistically review every single repository–but by distributing the burden of the reviews out to the people most familiar with the system in question, we solve both of these problems.
Of course, there’s one prerequisite to doing this type of thing, which is that you need to know who the right people are to review changes to a given repository. We have a standard for this: a reviewers.yml file in the repository containing the information, and a Gerrit hook that adds reviewers to all new patch sets based on the contents. Now we just need to bootstrap these files with a guess at the right people. To do this, I ran the following shell script a couple days ago (for simplicity, I’ve elided a few unimportant details):
for project in `gg-gerrit-ls-projects`; do
{% highlight python %}
{% endhighlight %}

{% endhighlight %}

{% highlight python %}
{% endhighlight %}

{% highlight python %}
    echo "master:" >> $yml
    for r in $reviewers; do
        echo "  - $r" >> $yml
{% endhighlight %}

{% endhighlight %}

{% endhighlight %}

{% highlight python %}
            gg-gerrit-set-reviewer --add --name $r --project $project --changeid $changeid
        done
    fi
fi
{% endhighlight %}
done

This runs through all of our projects, checks to see if the reviewers file exists, and, if it doesn’t already, the script makes a guess that the top three authors from the past 20 commits are a reasonable set of reviewers. It then submits that as a patch set to Gerrit, and adds that same set of people as reviewers. (For the curious, the gg-gerrit-* commands are wrapper scripts to the Gerrit CLI.)
After a few days, the identified reviewers have already looked over and approved the submitted patches, sometimes with modifications. Because there were no potential negative consequences, I then ran another small shell script which also used the Gerrit CLI to find, approve, and submit the remaining ones. Six hundred repositories had been updated to a current standard–a feat which would have been nearly impossible without the freedom which code review gives us to make heuristic or speculative changes from automated tools and the power of the Gerrit command line interface.

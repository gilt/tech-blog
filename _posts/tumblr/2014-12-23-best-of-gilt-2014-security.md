---
layout: post
title: 'Best of Gilt 2014: Security'
date: '2014-12-23T17:29:00-05:00'
tags:
- Gilt
- Gilt Groupe
- Gilt Tech
- gilttech
- Chip Durland
- security
- CloudFlare
- DDoS
- ransom note
- DDoS attacks
- TTLs
- phishing
- phish
- masquerading
- Verisign
- Prolexic
- OpenSSL
- Mike Hendren
- Phishing Frenzy
- bestof2014
tumblr_url: http://tech.gilt.com/post/105997682729/best-of-gilt-2014-security
---


Photo of dangerous hacker by Mike Hendren at Creative Commons.
2014 was a wild ride in the security world. We saw everything from crazy vulnerabilities in very popular software (looking at you, OpenSSL) to massive DDoS attacks against…well, everyone. Being an e-commerce company with nine million members, Gilt is always facing attacks from hackers and fraudsters alike. Here are three things that we learned in 2014 that helped us stay in the saddle, security-wise:
1. Prepare for the DDoS
Sending a ransom note to extort money from top tech companies, then following up with DDoS attacks on companies who refused to comply, was a very common tactic used by hackers this year. Meetup, SAY Media, Vimeo and other major companies all suffered headaches caused by hackers who deployed this strategy. And the size of DDoS attacks has grown larger than ever, as Verisign and Prolexic (two leading Internet security firms) both report.
The best way to counter these attacks is to get some sort of DDoS protection in place. Gilt jumped on board with CloudFlare, a company whose specialty is blocking DDoS attacks. CloudFlare has been experiencing something of a business windfall in recent years thanks to the spike in attacks–as CNBC reports, the company plans to build a new data center per week in the coming year–and we’ve had a great experience working with them.
A word to the wise: Lower your DNS TTLs. If you need to get behind a service like Cloudflare, having lower-than-average TTLs will help you to move traffic over to your new DDoS-protected IPs more quickly. Otherwise, your traffic will be stuck hitting the old IPs until the ISPs’ DNS cache refreshes. 
2. Have solid plans/policies in place
Everyone uses their plans and policies for more than “compliance,” right? 
Right????
With all of the breaches and leaked-credential attacks on companies worldwide, we’ve seen an increase in credential brute-force attacks. In these, attackers gain access to batches of user:password combos, then try them all until he finds one that works. The first question that everyone asks when such an attack occurs is, “What do we do?” How prepared your company is to respond can mean the difference between successfully mitigating an attack and having to ask your security team, “Wait–how many accounts has the attacker accessed?” 
Speed in incident response is key. Plan for security issues and develop policies for acting quickly should they befall your company. Make sure everyone knows their role and works quickly to close the issue.
3. Be alert to new kinds of phishing attacks
Security buffs (and attackers) all know that phishing 1) works well and 2) is the easy way into a network. One increasingly common phishing tactic involves attackers impersonating C-level executives in order to get employees to quickly carry out ad-hoc tasks, such as wire-transferring money to a fraudulent account. At Gilt, we’ve combated this by establishing a rule to prepend “Potential Phishing Attempt!” to subject lines for specific emails that appear to come from a Gilt email account, but are actually spoofed. The check compares the Sender with the SPF record, and prepends the phishing subject line to any email subject that violates the rule.
4. Train your users
As with most things in life, the best way to get better at doing something (like avoiding phishing emails) is through practice. To this end, we’ve started using Phishing Frenzy, an open source phishing framework, to phish our own user base and train them to better spot real phishing attacks. 
Attackers are getting more and more sophisticated all the time. Luckily, so are security engineers. With that, we wish you a safe and secure holiday and a phish-free 2015.

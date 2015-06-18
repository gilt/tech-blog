---
layout: post
title: Five Questions You Must Ask Your PCI Auditor Before You Hire Them
date: '2011-03-04T11:12:00-05:00'
tags:
- security
- PCI compliance
- payment card industry data security standard
- qualified security assessor
- QSAs
- hiring a QSA
- PCI audit
- Aleksandr Yampolskiy
tumblr_url: http://tech.gilt.com/post/3638463510/five-questions-you-must-ask-your-pci-auditor
---
Cautionary Tale Told By My Friend
The QSA walked into the conference room, sat down and took out a thick beige folder labeled “PCI.“ She looked uneasy as she started going down the list of questions from top-to-bottom:
 - “Umm okay, requirement 8.1. Identify all users with a unique user name … Do you do that?” she asked.
 - “Yes, we do. However in a few cases we have to use generic accounts in our legacy systems. Access to these generic accounts is restricted and carefully audited.”
- “That’s no good. You have to re-architect your legacy systems,” she replied.
She took out a gum and started chewing, staring intently while waiting for the response. 
At that point my friend (and a fellow CISO at an online retailer) paused and nervously sipped his tea. The next day he called the QSA’s manager and she was taken off the project. He had to search for a new QSA.
What is PCI?
The PCI DSS (payment card industry data security standard) was created by a consortium of credit card companies to enforce a set of minimum security standards. If your company accepts credit cards as a form of payment, then it must comply with the PCI standard. Companies who are Level 1 merchants (processing over 6 million Visa transactions annually) must undergo an onsite data security assessment by a QSA (qualified security assessor) who signs off on their PCI compliance status. 
Unfortunately, many organizations view PCI compliance as a “necessary evil” and aim to get it over with as quickly as possible. They will hire the first QSA that comes along who is going to check off the boxes in the PCI questionnaire and give a stamp of approval. Many smaller companies who are not Level 1 merchants are eager not to hire a QSA to save money since they are not obligated to do so. These are all crucial mistakes. You want to use PCI compliance to tighten the security in your company, and you don’t want a QSA to let you off easy. You want your QSA to be knowledgeable, fair and impartial.
 
 The Five Questions You Need To Ask
Before hiring a QSA, make sure you obtain as much information as possible about him. So before letting him come in and grill you, turn the tables around and interview your QSA.
We now list the five questions that you can’t hire your QSA without asking:
 1. Can you show me your CV?
A good QSA needs to have sufficient security and technical skills to effectively perform the audit. Just understanding the PCI DSS specification is not enough. The best QSAs will have a background in Information Security and experience working as a penetration tester, risk analyst or a CISO. This background will enable them to make tough judgment calls, assess if your firewall configurations are correct, and understand if your compensating controls are sufficient.  Note that you can verify the QSA’s standing at the following link: http://bit.ly/bomYyZ . Also, you can use this link https://www.pcisecuritystandards.org/pdfs/pci_qsa_list.pdf to check QSA companies which have at least one QSA who failed to perform an adequate PCI DSS assessment. 
 2. What types of companies have you provided assessments for?
Make sure that the QSA you hire has performed PCI audits of companies in your line of business and knows the challenges that they face.   If you are in an e-commerce business, selling luxury goods online, and the QSA has only dealt with large financial services firms, he may not be the right guy for the job.
3. What is your stance on compensating controls?
The goal here is to eliminate QSAs who read the requirements verbatim. The only requirement written in stone is requirement 3.2 (Do not store sensitive authentication data subsequent to authorization).   All other requirements need to convey intent.  For example, it’s perfectly ok to use a compensating control if you can’t assign a unique ID to every user (requirement 8.2) as long as you document and monitor all generic, shared IDs. A good QSA will understand that, while a bad one will force you to waste valuable time re-architecting your system without making it secure just to meet the requirement verbatim. When you interview a QSA, don’t be afraid to dig in further - give a concrete scenario where your company had to use a compensating control and see how the QSA reacts.  
4. How much do you charge, and what are the deliverables at the end of the engagement?
The best QSAs are usually employed by the best QSA companies and they do not come cheap. Be wary of selecting a security vendor, who also happens to do PCI audits on the side, just to save a few bucks. A simple PCI audit which lasts a few weeks onsite will cost you $20K-$30K. More extensive PCI audits will cost on the order of $100K.  So if you have allocated low budget towards a PCI audit, you are setting yourself up for failure.
There are two types of services which QSAs usually offer:
-       Gap analysis (a.k.a a PCI preparedness exam): A QSA will assess how prepared you are for the PCI audit. He will advise you on what remains to be done, and what controls you may need to change to pass the audit. The results of a gap analysis are not reported. 
-       PCI audit: This is the real thing, where a QSA will request documentation, interview appropriate personnel, and assess your controls. At the end of the audit, you should expect to receive an IROC (initial report on compliance). You will have roughly 4 months to remediate any found gaps, after which you will receive a final ROC (report on compliance). 
 5. Will you be available throughout the year in case we have any questions?
PCI compliance represents a point in time and not a permanent state of being. You will have to maintain PCI compliance throughout the year and naturally questions may arise. You want to stay in touch with your QSA auditor, maintain a good relationship, and hopefully hire him to come back the following year.  So if your QSA tells you that he is planning a two-year vacation to Hawaii or that you need to route all questions through his company’s support line, run away!
   
Aleksandr Yampolskiy, Ph.D. is a Director of Security and Compliance at Gilt Groupe, where he is responsible for risk management, PCI compliance, secure coding, IT infrastructure security, and security awareness and training.
 

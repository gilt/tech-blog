---
layout: post
title: Create PDFs from Scala Using HTML, CSS and JavaScript
date: '2013-09-10T14:31:00-04:00'
tags:
- sPDF
- wkhtmltopdf
- CSS
- JavaScript
- open source
- Scala
- Federico Feroldi
- PDFs
- libraries
- HTML
- Cloudify
- PDFkit
tumblr_url: http://tech.gilt.com/post/60858935846/create-pdfs-from-scala-using-html-css-and
---
Gilt Senior Software Engineer Federico Feroldi just released sPDF (pronounced speedy-f): a Scala library that makes it super-easy to create complex PDFs from HTML, CSS and JavaScript. On the backend sPDF uses wkhtmltopdf, which renders HTML using Webkit.
In creating sPDF, Federico was heavily inspired by Ruby’s PdfKit gem, which also uses HTML, CSS and wkhtmlopdf to create PDFs. 
sPDF’s main features include:
full support of wkhtmltopdf extended parameters (see the source of the PdfConfig trait)
can read HTML from several sources: java.io.File, java.io.InputStream, java.net.URL, scala.xml.Elem, and String
can write PDFs to File and OutputStream
The source HTML can reference to images and stylesheet files as long as the URLs point to the absolute path of the source file. It’s also possible to embed JavaScript code in the pages: wkhtmltopdf will wait for the document-ready event before generating the PDF.
This is Federico’s second open source Scala library. His other recent project, Lucene Sugar, provides a more concise syntax for the Lucene API in the Scala language. Let him know what you think of both projects by contacting him via his GitHub page.

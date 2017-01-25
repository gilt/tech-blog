# Our latest open source project: Scala-Fedex

We recently made the decision to switch from Newgistics to FedEx's Smartpost for customer returns from Gilt. A couple of factors contributed to the decision but the prettiness of FedEx's API was not one of them - it's not exactly the most developer friendly API you can find (they're still using SOAP and WSDLs).

We dug into their advanced services to generate the service we need and generated sample code to create shipments, our specific use case for the API. The sample code we got was a little bulky and not well packaged but we got it working. Still, we wanted to do more.

After digging around to see how we could generate our own client, we found scalaxb and used it to intergrate with the SOAP API to create a command line interface to point to a WSDL file and spit out what we need. It worked and scalaxb actually generates some really nice Scala code. So we went ahead and created a thin async Scala wrapper that's on top of the Java client to integrate with FedEx's Ship Service SOAP API. Now we can use this to generate FedEx return labels on our site using a nice looking Scala file. Boom! 

Recognizing the growing popularity of Scala, we decided to open source everything to help other scala shops that might be integrating with the FedEx API for a similar use case. You can find more specifics on the project here: [Gilt Scala FedEx](https://github.com/gilt/scala-fedex). 
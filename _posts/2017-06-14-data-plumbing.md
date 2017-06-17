---
layout: post
title: Data Plumbing at Hudson's Bay Company
author: Mike Hansen
date: '2017-06-14'
categories: 'data'
tags:
- data plumbing
- avro
- protobuf
- thrift 
---

<img src="http://3.bp.blogspot.com/-4Cdcb5VBORc/ToGDpJR7-zI/AAAAAAAAAzg/V9iF-FXAozk/s1600/mario-with-wrench.bmp" align="left" width="250"/>Today there’s a lot of buzz around machine learning, data mining, predictive analytics, etc. All very interesting areas, for sure, but none of this would be practical or even possible without the, less glamorous, work of data plumbing!  

The data plumber’s core mission is to 1) assimilate/ingest and 2) curate the raw data so that it’s useful for the business stakeholders and data scientists. The most important part of the data plumbing (and most value-add) is in curation and integration of the data. Given that, it’s in everyone’s best interest to _fully automate all low-level data assimilation/ingestion_ and let the data engineer focus on data curation and integration - that’s where the gold-spinning is located...

At Hudson's Bay Company, we have thousands of very different data sources that needs to be ingested (daily or intra-day) into our Data Lake (being “old school”, I really just see “Data Lakes” as an over-hyped term for data warehouse staging of data). There is no shortage of frameworks out there to assist with this kind of plumbing work. However, we have found that these frameworks tend to fall into one of two categories, either 1) too bloated and complex or 2) too specialized and thus requires multiple frameworks in order to solve all your data plumbing use cases.. 

If you run a large data plumbing shop and there was a data ingestion framework that solved 95% of your use cases, while not being too bloated and overly complex, you should still think twice (and do lot’s of experimentation) before adopting it. Most ELT/pipeline frameworks are pretty agile to work with in terms in day-to-day data tasks. However, frameworks comes and goes, and replacing them with next generation is _almost always anti-agile!_ It is much more agile, and organic, to find some general principles required to solve your current and anticipated use cases around data plumbing, and then build your own lightweight tooling and apps around these. This makes it easier to move with the times and gradually improve, or replace, components as your use cases evolve and change. One of these core principles would be to find a “Lingua Franca” for structure and (de)serialization of your data sources and Data Lake.

## Avro - our Lingua Franca

At Hudson's Bay Company, our data sources can be split into 3 main categories: _databases_, _files_, and _real-time streaming_. All three types are dramatically different in their structure (or lack thereof), retrieval, serialization, deserialization, etc. However there is one principle that you can apply to all of these - it’s much simpler to work with the datasets if they adhere to well-defined and evolvable schemas. More importantly, if these schemas are system, environment, and programming language agnostic, as well as, being easily accessible from anywhere within your organization, you can use them to automate your data ingestion processes!

Most relational SQL databases uses well-defined and evolvable schemas, but is not always the case for NoSQL databases. Files are rarely schematized, even JSON data files can be nightmarish to deal with, as there are not always strict schema enforcement. There may or may not be structure in your real-time streams, depending on how these are implemented. 

So to automate all work with these very heterogeneous data sources, we need to bridge them in terms of programming-friendly schemas and serialization.  As of this writing, there are 3 proven protocols to (de)serialize and schematize your data (streaming and files alike) in an agnostic manner - [Avro](http://avro.apache.org/), [Protobuf](https://github.com/google/protobuf), and [Thrift](http://thrift.apache.org/). We chose Avro, as it was best suited for our particular use cases. Regardless of your situation the, slightly subtle, matter of schema evolution will like likely play a large role in your decision making (to see a great comparison between the three, see [this](http://martin.kleppmann.com/2012/12/05/schema-evolution-in-avro-protocol-buffers-thrift.html) by Martin Kleppmann).  

We have been using Avro as our Lingua Franca on the Hudson's Bay Company data team a several years by now and have evolved to the below.  

<img class="center" src="http://i.imgur.com/0ZhMHLs.png"/>

Our data type mapping and (de)serialization libraries around Avro are:
* delimited and fixed field files to Avro files
* JSON streaming events to Avro events, and vice-versa
* JSON files to Avro files,and vice-versa
* Avro to Parquet types and vice-versa
* Avro to TeraData Aster SQL types and vice-versa
* PostgreSQL JDBC resultsets to Avro
* Oracle JDBC resultsets to Avro

Also, to automate processes, we created auto-detection and creation of Avro schemas for:
* PostgreSQL tables
* Oracle tables
* Delimited files

One important thing about data mapping and Avro is that it will likely _not_ support all your data type use cases out-of-the-box.  For example, if you are in banking or finance, it may not be sufficient to express _amounts_ in terms double values or even the new logical data type of decimal, introduced in Avro 1.8.x.  Rather you may need to express them in terms of two fields, decimal and currency code:

```
{"namespace": "com.gilt",
 "type" : "record",
 "name" : "Money",
 "fields" : [
   {
     "name" : "amount",
     "type" : {
       "type" : "bytes",
       "logicalType" : "decimal",
       "precision" : 12,
       "scale" : 2
     }
   }, {
     "name" : "currencyIso4217Code",
     "type" : "string"
   }]}
```

Another common data type not supported in Avro (yet) is UUID. Again, some minor extensions will be required for the mapping and (de)serialization, for example:

```
{ "name": "my_uuid_field",
  "type": {
   "namespace": "gfc.avro",
   "type": "fixed",
   "size": 16,
   "name": "UUID"
 }}
```

Then to encode an UUID to Avro, usinng Scala, you can do something along these lines:
```Scala
/** Converts UUID to avro bytes. */
def encodeAvro( uuid: UUID): GenericData.Fixed = {
  new Fixed(uuidAvroSchema, encodeBytes(uuid))
}

private def encodeBytes( uuid: UUID): Array[Byte] = {
  val bos = new ByteArrayOutputStream(16)
  def writeLong(l: Long) {
    for ( i <- 7 to 0 by -1 ) {
      bos.write((l >> (i*8) & 0xFF).toInt)
    }
  }
  writeLong(uuid.getMostSignificantBits)
  writeLong(uuid.getLeastSignificantBits)
  bos.toByteArray
}
```

One last thing on your lingua franca choice, spend some time thinking, discussing, and experimenting before you commit to one, as this will likely be the one component that needs to survive the changes of the times, as it will be the most difficult to replace.

## Tooling and Automation surrounding your Lingua Franca

Data type mapping and (de)serialization just takes care of the low level work.  To put these libraries to good use, we created a few micro-services and command-line tools. These applications and tools falls into four categories - shared, real-time data, databases, and files.

#### Shared:
* An RESTful Avro schema registry that hold all schemas and their versions.
* Tools to register/update schemas.
* Tools to detect exact schema compatibility issues and their causes (the default Avro compatibility check is not very user-friendly).
* Aster SQL/MRs for importing and exporting Avro files in and out of our data warehouse.

#### Real-time Streaming
* An auto-scaled RESTful service, _svc-event_, to receive real-time events (JSON or Avro) from anywhere within Hudson's Bay Company.
* A combination of AWS Lambda services and AWS Firehose for micro-batching the real-time streams into Avro files for consumption in the Data Lake.

#### File Conveyor Belt
* A service, _dung-beetle_, (build on [sundial](https://github.com/gilt/sundial)) listen for new/raw files in S3, as well as, polls SFTP sites for files. Once a new file enters the conveyor belt, _dung-beetle_, it 1) validate it according to it's schema specs, 2) converts it to an Avro file, 3) encrypt it, 4) push it to S3, and 5) push the file's data into the Data Lake.

#### Database Assimilator
* A batch utility, Borg, that replicates tables from various source databases, into the Data Lake. This tool eliminates deep integration requirement between databases, as well as inefficient real-time calls or sync-up integration, by simply mixing together the ingredients of JDBC, Avro, and Functional Streams for Scala ([fs2](https://github.com/functional-streams-for-scala/fs2)). We are able to get this database-to-data-lake synchronization down to hourly.

To add a database table for assimilation to the Data Lake, a developer can simply add the following entry:
```YAML
exports: 
  - database: Database name
    schema:   Table's schema name
    table:    Table name
    filter:   (Optional) Datetime column to filter on for incremental exports. If left out, 
              the export will dump out the entire table every time it's run.  
```

<img class="center" src="http://i.imgur.com/t1VK4mh.png"/>

At the core of our Data Lake we use AWS S3 and Glacier. Even though less than 5% of our sources holds PII data, we _always_ assume that data holds sensitive information so our defacto is client-side _and_ server-side encryption using AWS KMS.  This removes manual security management and administration, as we no longer need to treat these in a “special cases.”  Also, it eliminates the risk that someone accidently adding a new PII data source without encryption.  

Note that none of the aforementioned file processing requires a large Hadoop or Spark cluster!  In our ecosystem 99% of incoming files are under 25 Gb in (compressed) size and do not require a larger cluster environment.  This allow us to use cheaper and more more flexibles alternatives, such as, AWS Batch or Batch or EC2 Container Services. 

## Conclusion

With this, we are now at a state where can add files, streams, and database tables without any coding involved whatsoever.  In addition, we made this self-service to the entire Tech community at Hudson's Bay Company, which is the only way to scale data plumbing with limited resources. 

It is now easy for our data engineers and use and access all these data source in their curation and integration work. Also, it is now easy for our data scientists to access and use all these data sources for machine learning, data mining, etc., without having to spend a big part of their time structuring and formatting their data inputs.       


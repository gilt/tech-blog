---
layout: post
title: Data Plumbing at Hudson's Bay Company
author: Michael Hansen
date: '2017-06-14'
categories: 'data'
tags:
- data plumbing
- avro
- protobuf
- thrift 
---

<img src="http://3.bp.blogspot.com/-4Cdcb5VBORc/ToGDpJR7-zI/AAAAAAAAAzg/V9iF-FXAozk/s1600/mario-with-wrench.bmp" align="left" width="250"/>Today there’s a lot of buzz around machine learning, data mining, predictive analytics, etc. All very interesting areas, for sure, but none of this would be practical or even possible without the, less glamorous, work of data plumbing!  

The data plumber’s core mission is to 1) assimilate/ingest and 2) curate the raw data so that it’s useful for the business stakeholders and data scientists. The most important part of the data plumbing (and most value-add) is in curation and integration of the data. Given that, it’s in everyone’s best interest to _fully automate all low-level data assimilation/ingestion_ and let the data engineer focus on data curation and integration - that’s where the gold-spinning is to be found!

At Hudson's Bay Company, we have thousands of very different data sources that needs to be ingested (daily or intra-day) into our Data Lake (being “old school”, I really just see “Data Lakes” as an over-hyped term for data warehouse staging of data). There is no shortage of frameworks out there to assist with this kind of plumbing work. However, we have found that these frameworks tend to fall into one of two categories, either 1) too bloated and complex or 2) too specialized and thus requires multiple frameworks in order to solve all your data plumbing use cases.. 

If you run a large data plumbing shop and there was a data ingestion framework that solved 95% of your use cases, while not being too bloated and overly complex, you should still think twice (and do lot’s of experimentation) before adopting it. Most ELT/pipeline frameworks are pretty agile to work with in terms in day-to-day data tasks. However, frameworks come and go, and replacing them with next generation is _almost always anti-agile_!  It is much more agile, and organic, to define some general principles required to solve your current and anticipated use cases around data plumbing, and then build your own lightweight, libraries, tooling, and apps around these. This makes it easier to move with the times and gradually improve, or replace, components as your use cases evolve and change. One of these core principles would be to find a “Lingua Franca” for structure and (de)serialization of your data sources and Data Lake.

## Avro - a Lingua Franca

At Hudson's Bay Company, our data sources can be split into 3 main categories: _databases_, _files_, and _real-time streaming_.  All three types are dramatically different in their structure, retrieval, serialization, deserialization, etc. However there is one principle that you can apply to all of these - it’s much simpler to work with the datasets if they adhere to well-defined and evolvable schemas. More importantly, if these schemas are system, environment, and programming language agnostic, as well as, being easily accessible from anywhere within your organization, you can use them to automate your data ingestion processes!

Most relational SQL databases use well-defined and evolvable schemas, but is not always the case for NoSQL databases. Files are rarely schematized, even JSON data files can be nightmarish to deal with. There may or may not be structure in your real-time streams, depending on how these are implemented. 

So to automate all work with these very heterogeneous data sources, we need to bridge them in terms of programming-friendly schema and serialization.  As of this writing, there are 3 proven protocols to (de)serialize and schematize your data, streaming and files alike, in an agnostic manner - [Avro](http://avro.apache.org/), [Protobuf](https://github.com/google/protobuf), and [Thrift](http://thrift.apache.org/). We chose Avro, as it was best suited for our particular use cases. Regardless of your situation, _schema evolution_ will like likely play a large role in your decision making (for a great comparison between the three, see [this](http://martin.kleppmann.com/2012/12/05/schema-evolution-in-avro-protocol-buffers-thrift.html) by Martin Kleppmann).  

We have been using Avro as our Lingua Franca on the Hudson's Bay Company data team a several years by now and have evolved to the below.  

<img class="center" src="http://i.imgur.com/0ZhMHLs.png"/>

Our data type mapping and (de)serialization libraries around Avro include:
* delimited and fixed field files to Avro files
* JSON streaming events to Avro events, and vice-versa
* JSON files to Avro files, and vice-versa
* Avro to Parquet types, and vice-versa
* Avro to TeraData Aster SQL types, and vice-versa
* PostgreSQL JDBC resultsets to Avro
* Oracle JDBC resultsets to Avro

To automate processes, we created auto-detection and creation of Avro schemas for:
* PostgreSQL tables
* Oracle tables
* Delimited files

One important thing about data mapping and Avro is that it will likely _not_ support all your data type use cases out-of-the-box.  For example, if you are in banking or finance, it may not be sufficient to express _amounts_ in terms double values or even the new logical data type of _decimal_, introduced in Avro 1.8.x.  Rather you may need to express them in terms of two fields, decimal and currency code:

```JSON
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

Another common data type not supported in Avro (yet), is UUID. Again, some minor extensions will be required for the mapping and (de)serialization, for example:

```JSON
{ "name": "my_uuid_field",
  "type": {
   "namespace": "gfc.avro",
   "type": "fixed",
   "size": 16,
   "name": "UUID"
 }}
```

To encode an UUID to Avro fixed type, using Scala, you simply convert your `java.util.UUID` to a byte array, and wrap it in an Avro `org.apache.avro.generic.GenericData.Fixed`, parsing the above `gfc.avro.UUID` schema (from a file or repository) into a `org.apache.avro.Schema`:
```Scala
/** Parse the schema from a file. */
def retrieveAvroSchemaFromFile(schemaFileLocation: String): org.apache.avro.Schema = {
  new org.apache.avro.Schema.Parser().parse(new File(schemaFileLocation))
}

/** Converts UUID to avro bytes. */
def encodeAvro(uuidAvroSchema:Schema uuid: UUID): GenericData.Fixed = {
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

One last thing on your lingua franca choice, spend time thinking, discussing, and experimenting before you commit to one, as this will likely be the one component that needs to survive the changes of time, as it will be the most difficult piece to replace.

## Tooling and Automation surrounding your Lingua Franca
Data type mapping and (de)serialization just takes care of the low level work.  To put these libraries to good use, we created a few micro-services and command-line tools. These applications and tools falls into four categories - shared, real-time streaming, databases, and files.

#### Shared:
* A RESTful Avro schema registry that holds all schemas and their versions.
* Tools to register/update schemas.
* Tools to detect exact schema compatibility issues and their causes (the default Avro compatibility check is _not_ very user-friendly).
* Aster SQL/MRs for importing and exporting Avro files in and out of our data warehouse.

#### Real-time Streaming
* An auto-scaled RESTful service, _svc-event_, to receive real-time events (JSON or Avro) from anywhere within Hudson's Bay Company. This service is backed by AWS Kinesis streams.
* A combination of AWS Lambda services and AWS Firehose for micro-batching the real-time streams into Avro files for consumption in the Data Lake or elsewhere.

#### File Conveyor Belt
* A service, _dung-beetle_, (build on [sundial](https://github.com/gilt/sundial)) that listen for new/raw files in S3, as well as, polls SFTP sites. Once a new file enters the conveyor belt, it 1) decrypt it 2) validate it according to its schema specs, 3) convert it to an Avro file, 4) encrypt it, 5) push it to S3, and 6) push the file's data into the Data Lake.

To add a new file source to the Data Lake is now very simple:
```YAML
  foo_bar_file:
    hermes: s3_copy # listen to S3 activity
    remote_bucket: foo-bar-s3-bucket
    remote_dir: foo/bar
    remote_filename_filters: "^.*foo.bar.csv.gz$"
    compress_type: gzip
    skip_first: true
    delimiter: ','
    load_db: true # whether or not to push to Data Lake
    fail_threshold: 100
    avro_namespace: com.gilt.foo.bar
    delete_post_fetch: false
 ```

#### Database Assimilator
* A batch utility, _borg_, that replicates tables from various source databases, into the Data Lake. This tool eliminates deep integration requirement between databases, as well as inefficient real-time calls or sync-up integration, by mixing together the ingredients of JDBC, Avro, and Functional Streams for Scala ([fs2](https://github.com/functional-streams-for-scala/fs2)). We are able to get this database-to-data-lake synchronization down to hourly, which is good enough for the vast majority of use cases.

To add a database table for assimilation to the Data Lake, an analyst can simply add the following entry:
```YAML
exports: 
  - database: Database name
    schema:   Table's database schema name
    table:    Table name
    filter:   (Optional) Datetime column to filter on for incremental exports. If left out, 
              the export will dump out the entire table every time it's run.  
```

<img class="center" src="http://i.imgur.com/t1VK4mh.png"/>

At the core of our Data Lake we use AWS S3 and Glacier. Even though less than 5% of our sources holds PII data, we _always_ assume that they hold sensitive information, and our defacto is to client-side _and_ server-side encrypt everything using AWS KMS. Doing so might seem like overkill, however it removed all manual security management and administration tasks, as we no longer need to treat PII data as special cases (requiring special handling).  Also, it eliminates the risk that someone accidently add a new PII data source without encryption.  

Note that _none_ of our data ingestion activities require a large Hadoop or Spark cluster, rather they can be accomplished by a pool of smaller and simpler environments. This allow us to use cheaper and more flexibles alternatives, such as, AWS Batch or EC2 Container Services, and save our Spark allowance for integration and curation of the data, which _does_ require "heavy lifting".

## Conclusion
With this, we are now at a state where developers and analysts can add files, streams, and database tables with simple configurations.  Now that data ingestion is codeless, we made it self-service to the entire Tech community at Hudson's Bay Company, which is the only way to scale data plumbing with limited resources. 

It is now easy for our data engineers to add data sources for their curation and integration work.  Also, it's easy for data scientists to access and use all these raw data sources for machine learning, data mining, etc., without having to spend their time structuring, loading, parsing, and formatting these.       


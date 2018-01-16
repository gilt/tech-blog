---
layout: post
title: "Sundial AWS EMR Integration"
author: Giovanni Gargiulo
date: '2018-01-16'
categories: 
- aws
- data
- machine learning
tags:
- aws
- sundial
- etl
- scheduling
- machine learning
---

# AWS Elastic Map Reduce on Sundial

Today I want to talk about a recent improvement we implemented in [Sundial](https://github.com/gilt/sundial), an Open Source product launched by Gilt in early 2016. With [Sundial 2.0.0](Add link to github tag) it's now possible to schedule AWS Elastic Map Reduce jobs.

For those of you who are not familiar with it, [Sundial](https://github.com/gilt/sundial) is a batch job scheduler, developed by the Gilt Personalization Team, that works with Amazon ECS and Amazon Batch.

Before jumping into the nitty gritty details, it's worth taking a deeper dive into the current batch job processing setup in Gilt and the challenges we have recently started to face. 

We will quickly cover the following areas:

* the current batch jobs setup
* batch job scalability 

## Batch processing today

Every night, the Gilt Aster data warehouse (DW) is locked down in order to update it with the latest data coming from the relevant area of the business. During this lock, Extract-Transform-Load ([ETL](https://www.webopedia.com/TERM/E/ETL.html)) suites, or [ELT as we prefer to call it](https://www.ironsidegroup.com/2015/03/01/_ETL_-vs-elt-whats-the-big-difference/), are
run. 
When all the jobs complete, the DW gets unlocked and the normal access to Aster is resumed. There are a number of client systems relying on the DW, most relevant are BI tools, i.e [Looker](https://looker.com/), and Sundial.
Sundial in particular is used in personalization for scheduling additional jobs and to build Machine Learning models. Since there is no synchronization between Aster and Sundial, occasionally when Aster takes longer to complete, Sundial jobs would fail because of the DW being still locked down or data being stale.  

## Performance degradation
    
Because Aster is a shared resource, and the number of jobs relying on it is increasing day by day, in the past few weeks we've experienced significant performance degradation.
This issue is particularly amplified at a specific time of the week, when BI reports are generated. The result is that batch jobs and reports are taking longer and longer to complete. 
This of course affects developers experience and productivity.

## EMR adoption

Because of all the nuisances above, there is additional operational time spent to restart failed jobs. Furthermore, when developing a new model, 
most of the time is spent extracting and massaging data, rather than focusing on the actual job logic.

It's easy to understand that Aster wasn't a good candidate anymore for us and that we needed to migrate to a better and more [elastic](https://en.wikipedia.org/wiki/Elasticity_(cloud_computing)) platform.  

The solution we were looking for should:

* work with multiple data formats
* be scalable 
* be owned by the team
* be easy to integrate with our scheduling solution

We didn't have to look far to find a great candidate to solve our problems: Spark running on [AWS EMR (Elastic Map Reduce)](https://aws.amazon.com/emr/). Amazon EMR provides a managed Hadoop framework that makes it easy, fast, and cost-effective to process vast amounts of data across dynamically scalable Amazon EC2 instances. 
You can also run other popular distributed frameworks such as Apache Spark, HBase, Presto, and Flink in Amazon EMR, and interact with data in other AWS data stores such as Amazon S3 and Amazon DynamoDB.

A complete list of open source applications (or components) running on AWS ERM can be found [here](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-release-components.html).

AWS EMR also offers a nice SDK to spin a new dynamic EMR cluster, run a job and tear down resources _on the fly_ and a cost per second billing system so to make the whole platform very cost efficient.

The last two perks of using AWS EMR are:

* [AWS Spot Instances](https://aws.amazon.com/ec2/spot/): running hardware at a discounted price
* [Large variety of hardware](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-supported-instance-types.html): most of ELT jobs run on commodity hardware, some ML require intensive GPU computation and EMR offers hardware solutions for all of our use cases.       

## The Sundial EMR Integration

Since we were already using Sundial for most of our ETL and ML heavy lifting, we decided to extend the Sundial `task_definition` and add a new `executable`: the `emr_command`. 

Features we've implemented are:

* running a Spark EMR job on a pre-existing cluster
* running a Spark EMR job on a new created-on-the-fly cluster (and automatic tear down of resources)
* choose between `on_demand` vs `spot` instances
* live logs

In the next two paragraphs I will go through two Sundial EMR task definition examples: the first is a Spark EMR job running on a pre-existing cluster, the second is the same job but running on a dynamically created cluster instead.  

### Running a job on a pre-existing EMR Cluster

Launching an EMR job on a pre-existing cluster is really simple, all that you need are some job details and the `cluster_id` where you want the job to run. 

```json
 "executable":{
    "emr_command":{
       "emr_cluster":{
          "existing_emr_cluster":{
             "cluster_id":"j-123ABC456DEF9"
          }
       },
       "job_name":"MyJobName1",
       "region":"us-east-1",
       "class":"com.company.job.spark.core.MainClass",
       "s3_jar_path":"s3://my-spark-job-release-bucket/my-job-spark-v1-0-0.jar",
       "spark_conf":[
          "spark.driver.extraJavaOptions=-Denvironment=production"
       ],
       "args":[
          "arg1", "arg2"
       ],
       "s3_log_details":{
          "log_group_name":"spark-emr-log-group",
          "log_stream_name":"spark-emr-log-stream"
       }
    }
 }
``` 

The other properties are:

* _class_: the fully qualified main class of the job, e.g. "com.company.job.spark.core.MainClass"
* _s3_jar_path_: the s3 path to the job jar file e.g "s3://my-spark-job-release-bucket/my-job-spark-v1-0-0.jar"
* _spark_conf_: this is a **list** of attributes that you can pass to the spark driver, like memory or Java Opts (as per above example)
* _args_: another list of params that will be passed to the **MainClass** as arguments (as per above example)
* _s3_log_details_: Cloudwatch Log Group and Stream names for your job. See [EMR Logs paragraph](#emr-logs)

#### EMR Logs 

One nice feature of Sundial is the possibility of viewing jobs' live logs. While AWS Elastic Container Service (ECS) and Batch natively offer 
a way to access live logs, EMR updates logs only every five minutes on S3 and it cannot be used as feed for live logs. Since there isn't a straightforward way of fixing this, it is developer's 
responsibility to implement the code that streams job's log to [AWS Cloudwatch Logs](https://aws.amazon.com/cloudwatch/). One way of achieving this is via the [log4j-cloudwatch-appender](https://github.com/speedwing/log4j-cloudwatch-appender).

The downside of having jobs running on _static_ AWS EMR clusters is that you will be paying for it even if no jobs are running. For this reason it would be ideal if we could spin up an EMR cluster _on-the-fly_, run a Spark job and then dispose all the resources. 

If you want to know more, well, keep reading! 

### Running a job on a dynamic EMR Cluster

The Sundial Task definition that uses a dynamic cluster is fairly more complex and gives you some fine grained control when provisioning your cluster. 
At the same time though, if your jobs don't require very specific configurations (e.g. permissions, aws market type), sensible default options have been provided so to simplify the 
Task Definition where possible.

Let's dig into the different sections of the json template.   

```json
"emr_cluster":{
  "new_emr_cluster":{
     "name":"My Cluster Name",
     "release_label":"emr-5.11.0",
     "applications":[
        "Spark"
     ],
     "s3_log_uri":"s3://cluster-log-bucket",
     "master_instance":{
        "emr_instance_type":"m4.large",
        "instance_count":1,
        "aws_market":{
           "on_demand":"on_demand"
        }
     },
     "core_instance":{
        "emr_instance_type":"m4.xlarge",
        "instance_count":2,
        "aws_market":{
           "on_demand":"on_demand"
        }
     },
     "emr_service_role":{
        "default_emr_service_role":"EMR_DefaultRole"
     },
    "emr_job_flow_role": {
      "default_emr_job_flow_role": "EMR_EC2_DefaultRole"
    },
     "ec2_subnet":"subnet-a123456b",
     "visible_to_all_users":true
  }
}
```

The json object name for a _dynamic emr cluster_ is `new_emr_cluster`. It is composed by the following attributes:

* _name_: The name that will appear on the AWS EMR console
* _release_label_: The EMR version of the cluster to create. Each EMR version maps to specific version of the applications that can run in the EMR cluster. Additional details are available on the [AWS EMR components page](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-release-components.html)
* _applications_: The list of applications to launch on the cluster. For a comprehensive list of available applications, visit the [AWS EMR components page](https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-release-components.html)
* _s3_log_uri_: The s3 bucket where the EMR cluster put their log files. These are both cluster logs as well as `stdout` and `stderr` of the EMR job
* _master_instance_: The master node hardware details (see below for more details.)
* _core_instance_: The core node hardware details (see below for more details.)
* _task_instance_: The task node hardware details (see below for more details.)
* _emr_service_role_: The IAM role that Amazon EMR assumes to access AWS resources on your behalf. For more information, see [Configure IAM Roles for Amazon EMR](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-iam-roles.html)
* _emr_job_flow_role_: (Also called instance profile and EC2 role.) Accepts an instance profile that's associated with the role that you want to use. All EC2 instances in the cluster assume this role. For more information, see [Create and Use IAM Roles for Amazon EMR](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html) in the Amazon EMR Management Guide
* _ec2_subnet_: The subnet where to spin the EMR cluster. (Optional if the account has only the standard VPC)
* _visible_to_all_users_: Indicates whether the instances in the cluster are visible to all IAM users in the AWS account. If you specify true, all IAM users can view and (if they have permissions) manage the instances. If you specify false, only the IAM user that created the cluster can view and manage it

#### Master, core and task instances

An EMR cluster is composed by exactly one master instance, at least one core instance and any number of tasks instances.

A detailed explanation of the different instance types is available in the [AWS EMR plan instances page](https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-plan-instances.html). 

For simplicity I'll paste a snippet of the AWS official documentation:

> * master node: The master node manages the cluster and typically runs master components of distributed applications. For example, the master node runs the YARN ResourceManager service to manage resources for applications, as well as the HDFS NameNode service. It also tracks the status of jobs submitted to the cluster and monitors the health of the instance groups. Because there is only one master node, the instance group or instance fleet consists of a single EC2 instance.
> * core node: Core nodes are managed by the master node. Core nodes run the Data Node daemon to coordinate data storage as part of the Hadoop Distributed File System (HDFS). They also run the Task Tracker daemon and perform other parallel computation tasks on data that installed applications require.
> * task node: Task nodes are optional. You can use them to add power to perform parallel computation tasks on data, such as Hadoop MapReduce tasks and Spark executors. Task nodes don't run the Data Node daemon, nor do they store data in HDFS.

The json below describes configuration details of an EMR master instance:

```json
 "master_instance":{
    "emr_instance_type":"m4.large",
    "instance_count":1,
    "aws_market":{
       "on_demand":"on_demand"
    }
 },
```

Please note that there can only be exactly one master node, if a different values is specified in the `instance_count`, it is ignored. For other instance group types the 
value `instance_count` represents, as the name says, the number of EC2 instances to launch for that instance type.

Other attributes are:

* _emr_instance_type_: the EC2 instance type to use when launching the EMR instance
* _aws_market_: the marketplace to provision instances for this group. It can be either `on_demand` or `spot`

An example of a EMR instance using spot is:
```json
"aws_market": {
    "spot": {
      "bid_price": 0.07
    }
 }
``` 

Where `bid_price` is the Spot bid price in dollars.

## Limitations

Because of some AWS EMR implementation details, Sundial has two major limitations when it comes to EMR job scheduling.

The first limitation is that Sundial is not able to stop EMR jobs running on pre-existing clusters. Since jobs on the EMR cluster are scheduled via `yarn` and since 
AWS did not build any api on top of it, once a job is scheduled on an existing EMR cluster, in order to kill it, it would be required to ssh on the EC2 instance where the master node is running, query `yarn` so to find out the
correct application id and issue a yarn kill command. We decided to not implement this feature because it would have greatly over complicated the job definition.
Jobs running on dynamic cluster are affected by the same issue. We've managed to still implement this feature by simply killing the whole EMR cluster.

The second limitation is about live logs. As previously mentioned live logs are not implemented out of the box. Developers require to stream logs to Cloudwatch Logs and set log group and log name in the task definition. 

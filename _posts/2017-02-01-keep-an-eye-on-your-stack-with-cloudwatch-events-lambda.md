---
layout: post
title: Keeping an Extra Eye on Your Stack with CloudWatch Events
author: Emerson Loureiro
date: '2017-01-25'
categories: 'aws'
tags:
- aws
- cloudwatch
- events
- lambda
- production
---

# Why an Extra Eye?

There's a lot going on in AWS; EC2 instances coming up, new releases being rolled out, services scaling up and down, new services and the underlying infrastructure being setup. If you own software running production, you probably know the drill; you need to ensure that the software and its supporting infrastructure are healthy and stable. You will also eventually need to diagnose production issues. In short, you need a way to keep an eye on your software. The scale at which we run things here at [Gilt](http://www.gilt.com), with over 300 services in production, each with multiple instances, means this is even more important.

In AWS, [CloudWatch Events](http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/WhatIsCloudWatchEvents.html) is a powerful tool for monitoring your resources. In very simple terms, it allows you to receive notifications about some of your infrastructure in production, and then lets you decide what to do with it. This last part is where Lambdas come in, and I'll go into the details of how that's done in a minute. First, let's look at some of the events you can receive with CloudWatch.

* **EC2**: instance state changes (*starting*, *running*, *stopping*, *stopped*, and *terminated*);
* **CodeDeploy**: deployment state changes (*started*, *succeeded*, *failed*);
* **AutoScaling**: instance terminated, instance added to AutoScaling Group;
* **ECS**: task state changes

# The Basic Framework

The framework for consuming these events consists of three parts: a [**CloudWatch rule**](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-rule.html), a [**permission**](http://docs.aws.amazon.com/lambda/latest/dg/intro-permission-model.html), and a **target**. In our case, the target is a [Lambda](https://aws.amazon.com/lambda/), but it can also be a SQS queue, an SNS topic and a few other things. The CloudWatch rule determines the actual event you are interested in receiving. The Lambda is what will receive the event and allow you to act on it (e.g., send an email notification). Finally, the permission binds the rule to the Lambda, enabling the Lambda invocation whenever the rule is met.

In a little bit more details, the CloudWatch rule consists of a `source` - i.e., the AWS service where the event originates - a `detail-type`, specifying the specific event you are interested in receiving - e.g., failed deployments - and finally a `detail` which is essentially a filter. For CodeDeploy deployments, for example, that would be which deployment groups the events should be fired for. Here's an example of a rule we actually use in production at [Gilt](http://www.gilt.com). This rule will fire events whenever instances under the production and canary [AutoScaling](https://aws.amazon.com/autoscaling/) groups of the service `some-service` are terminated.

```json
{
  "detail-type": [
    "EC2 Instance Terminate Successful"
  ],
  "source": [
    "aws.autoscaling"
  ],
  "detail": {
    "AutoScalingGroupName": [
      "some-service-production-auto-scaling-group",
      "some-service-canary-auto-scaling-group"
    ]
  }
}
```

You can create the rule in different ways, for example via the console, and the code snippet above is the representation of the rule from CloudWatch's point of view. Here at [Gilt](http://www.gilt.com), we usually use [CloudFormation](https://aws.amazon.com/cloudformation/) stacks for creating resources like that, and I will illustrate how to do that in a little while.

But, first, how exactly have we been using that? There are two use cases, actually. In one case, we want to be notified when an instance is terminated due to a healthcheck failure. This essentially means that the instance was running and healthy, but for whatever reason the healthcheck failed for some amount of time, and the instance was killed by the auto scaling group. This is definitely something we want to be aware of, as it may indicate a pattern on certain services - e.g., the instance type for this service is no longer enough, as it keeps on dying with an out of memory error. The other use case is for deployments. Either to know when the deployment for a new release is finished, or to help piecing together a timeline of events when investigating production issues.

# The CloudWatch and Lambda Setup

Now let's get into the details of how we have set that up, starting with the instance termination events. As I said early on, for creating resources in AWS, typically we rely on CloudFormation stacks, so it's no different with our CloudWatch event + Lambda setup. Here's the CloudFormation template that creates the CloudWatch rule for instance termination events.

```yaml
InstanceTerminationEvent:
    Type: AWS::Events::Rule
    Properties:
      Name: my-instance-termination-rule
      State: ENABLED
      Targets:
        - Arn: arn:aws:lambda:us-east-1:123456789:function:my-instance-termination-lambda-function
          Id: my-instance-termination-rule-target
      EventPattern:
        source: ['aws.autoscaling']
        detail-type: ['EC2 Instance Terminate Successful']
        detail:
          AutoScalingGroupName:
            - !Ref YourAutoScalingGroup
            - !Ref AnotherOfYourAutoScalingGroup
```

When the rule is matched to an event, given the conditions stated on the template, it will invoke the target - in this case a Lambda. The ARN of the Lambda is then provided as the value of the target. This rule is essentially stating that, when an EC2 instance is terminated within the auto scaling groups defined, the Lambda should be triggered. The event itself is then used as the input to the Lambda.

Remember though that you also need a permission to allow the rule to invoke the target. Here's how we define it on a CloudFormation template.

```yaml
InstanceTerminationLambdaPermission:
    Type: AWS::Lambda::Permission
    Properties:
      Action: lambda:*
      FunctionName: arn:aws:lambda:us-east-1:123456789:function:my-instance-termination-lambda-function
      Principal: events.amazonaws.com
      SourceArn: !GetAtt ['InstanceTerminationEvent', 'Arn']
```

The Lambda itself is an exception; instead of creating it via a CloudFormation template, we simply defined it via the console. That way, it's simpler to test it out as and perform code changes. Below is our Lambda - in Python - which takes the instance termination events and sends an email to our team with details around the instance that has been terminated, the time, and also the cause. In this particular case, as I mentioned above, we are only interested in instances that have been terminated due to a health check failure, so the cause on the emails will always be the same. It's worth pointing out though that the email notification is just one option. You can also, for example, integrate your Lambda with something like [PagerDuty](https://www.pagerduty.com/) if you wish to have more real time alerts.

```python
import boto3

# A wrappper for the instance termination event we get from AWS
class Ec2TerminationEvent:
    def __init__(self, event):
        detail = event['detail']
        self.instance_id = detail['EC2InstanceId']
        self.cause = detail['Cause']
        self.terminated_at = detail['EndTime']
        self.is_health_check_failure = self.cause.endswith('ELB system health check failure.')
        ec2_client = boto3.client('ec2')
        # Fetching the instance name
        instance = (((ec2_client.describe_instances(InstanceIds=[self.instance_id])['Reservations'])[0])['Instances'])[0]
        instance_tags = instance['Tags']
        self.instance_name = None
        for instance_tag in instance_tags:
            tag_key = instance_tag['Key']
            if tag_key == 'Name':
                self.instance_name = instance_tag['Value']

def lambda_handler(event, context):
    print('Received EC2 termination event: {}'.format(event))
    ec2_termination_event = Ec2TerminationEvent(event)
    if ec2_termination_event.is_health_check_failure:
        print('Event for instance {} is a health check failure'.format(ec2_termination_event.instance_id))
        send_email(ec2_termination_event)
    return 'ok'

def send_email(ec2_termination_event):
    ses_client = boto3.client('ses')
    # Simply change the email address below to the one for your
    # team, for example
    destination = { 'ToAddresses': ['your-email-address@your-domain.com'] }
    email_subject = { 'Data': 'EC2 Instance {} Terminated'.format(ec2_termination_event.instance_id) }
    email_body = { 'Html': { 'Data': create_message_text(ec2_termination_event) } }
    email_message = { 'Subject': email_subject, 'Body': email_body }
    # Also change the email addresses below to the ones applicable
    # to your case
    send_email_response = ses_client.send_email(Source='email-address-to-send-to@your-domain.com', Destination=destination, Message=email_message, ReplyToAddresses=['your-email-address@your-domain.com'])
    message_id = send_email_response['MessageId']
    print('Successfully sent email with message id {}'.format(message_id))

def create_message_text(ec2_termination_event):
    instance_id_line = '<b>Instance</b>: <a href=\"https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#Instances:search=' + ec2_termination_event.instance_id + ';sort=tag:Name\">' + ec2_termination_event.instance_id + '</a><br>'
    ec2_termination_event.instance_name_line = ''
    if ec2_termination_event.instance_name is not None:
        instance_name_line = '<b>Instance name</b>: ' + ec2_termination_event.instance_name + '<br>'
    cause_line = '<b>Cause</b>: ' + ec2_termination_event.cause + '<br>'
    terminated_at_line = '<b>Terminated at</b>: ' + ec2_termination_event.terminated_at + '<br>'
    return  instance_id_line + instance_name_line + cause_line + terminated_at_line
```

For our deployment notifications, the setup is fairly similar. For this, as I said before, we are only interested in events for deployments that have succeeded (even though the setup here can be easily extended to include failed deployments too!). Here is the CloudFormation template snippet for creating the rule and the permission.

```yaml
CodeDeploySuccessNotificationEvent:
    Type: AWS::Events::Rule
    Properties:
      Name: my-deployment-successful-rule
      State: ENABLED
      Targets:
        - Arn: arn:aws:lambda:us-east-1:123456789:function:my-deployment-successful-lambda-function
          Id: my-deployment-successful-target
      EventPattern:
        source: ['aws.codedeploy']
        detail-type: ['CodeDeploy Deployment State-change Notification']
        detail:
          state: [SUCCESS]
          application: [!Ref YourCodedeployApplication]
CodeDeploySuccessNotificationEventLambdaPermission:
    Type: AWS::Lambda::Permission
    Properties:
      Action: lambda:*
      FunctionName: arn:aws:lambda:us-east-1:123456789:function:my-deployment-successful-lambda-function
      Principal: events.amazonaws.com
      SourceArn: !GetAtt ['CodeDeploySuccessNotificationEvent', 'Arn']
```

And below is the Lambda that receives the event, and sends out an email notification. On the email it will be included the application name, the deployment group where the deployment has happened, as well as the release version. Our actual Lambda in production also fires a deployment notification to NewRelic. In there you have a history of the releases for a given service, and how metrics have changed since each release. That can come in handy when establishing timelines and finding out exactly which release is broken.

```python
import boto3
import httplib

# A wrapper for the deployment successful we receive
# from CodeDeploy. Extracs the application, deployment
# group, release version, etc.
class CodeDeployEvent():
    def __init__(self, event):
        detail = event['detail']
        self.application = detail['application']
        self.deployment_id = detail['deploymentId']
        self.deployment_group = detail['deploymentGroup']
        codedeploy_client = boto3.client('codedeploy')
        deployment = codedeploy_client.get_deployment(deploymentId=self.deployment_id)
        self.version = None
        self.release_file = None
        revision = (deployment['deploymentInfo'])['revision']
        if (revision['revisionType'] == 'S3'):
            s3_location = revision['s3Location']
            self.release_file = s3_location['key']
            last_slash_index = self.release_file.rfind('/')
            last_dot_index = self.release_file.rfind('.')
            self.version = self.release_file[last_slash_index + 1:last_dot_index]

def lambda_handler(event, context):
    code_deploy_event = CodeDeployEvent(event)
    print('Received success deploy {} for application {} and deployment group {}'.format(code_deploy_event.deployment_id, code_deploy_event.application, code_deploy_event.deployment_group))
    send_email(code_deploy_event)
    return 'ok'

def send_email(code_deploy_event):
    ses_client = boto3.client('ses')
    # Simply change the email address below to the one for your
    # team, for example
    destination = { 'ToAddresses': ['your-email-address@your-domain.com'] }
    email_subject = { 'Data': 'Deployment {} Successful'.format(code_deploy_event.deployment_id) }
    email_body = { 'Html': { 'Data': create_message_text(code_deploy_event) } }
    email_message = { 'Subject': email_subject, 'Body': email_body }
    send_email_response = ses_client.send_email(Source='email-address-to-send-to@your-domain.com', Destination=destination, Message=email_message, ReplyToAddresses=['your-email-address@your-domain.com'])
    message_id = send_email_response['MessageId']
    print('Successfully sent email with message id {}'.format(message_id))

def create_message_text(code_deploy_event):
    deployment_id_line = '<b>Deployment id</b>: <a href=\"https://console.aws.amazon.com/codedeploy/home?region=us-east-1#/deployments/' + code_deploy_event.deployment_id + '\">' + code_deploy_event.deployment_id + '</a><br>'
    version_line = '<b>Revision</b>: ' + code_deploy_event.version + '<br>'
    application_line = '<b>Application</b>: ' + code_deploy_event.application + '<br>'
    deployment_group_line = '<b>Deployment group</b>: ' + code_deploy_event.deployment_group
    return deployment_id_line + version_line + application_line + deployment_group_line
```

# Final Thoughts

We have had this setup running in one of our teams here at [Gilt](http://www.gilt.com) for quite a few months now, and the results are satisfying. Instance termination events, given their real time nature, allow us, for example, to act quickly and prevent potential outages on our services. Also, it has already allowed us to identify services that had not enough memory allocated, and thus needed code changes or a change of instance type in order to stabilize them. In short, it's giving us a level visibility we never really had before and enabling us to be more proactive towards keeping our services in good shape. 

Finally, deployment notifications add more to the debugging side of things. They let us establish a timeline of events - e.g., when releases have gone out - and with that more quickly identify releases and code changes that have broken a particular service in production. Ultimately, this speeds up the process of bringing a service back to a healthy state. We feel like our current setup is enough for our needs, but certainly we will be looking at expanding the range of events we are watching out for when the need arises. At the end of the day, it's all about having quality information in order to help keep our services running well.
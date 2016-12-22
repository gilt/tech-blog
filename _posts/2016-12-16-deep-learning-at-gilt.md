---
layout: post
title: "Deep Learning at GILT"
author: Pau Carré Cardona
date: '2016-12-16'
categories: 'machine learning', 'deep learning'
tags:
- deep learning
- Pau Carré Cardona
- machine learning
- computer vision
---

# Cognitive Fashion Industry Challenges

In the fashion industry there are many tasks that require human-level cognitive skills,
such as detecting similar products or identifying facets in products (e.g. sleeve length or silhouette types
in dresses).

In GILT we are building automated cognitive systems to detect dresses based on their silhouette, neckline, sleeve type and occasion.
On top of that, we are also developing systems to detect dress similarity which can be
useful for product recommendations. Furthermore, when integrated with automated tagging,
our customers will be able to find similar products with different facets. For instance,
a customer might be very interested in a dress in particular, but with a different neckline
or sleeve length.

For these automated cognitive tasks we are leveraging the power of a technology called Deep Learning that recently managed to [achieve groundbreaking results](https://www.youtube.com/watch?v=SUbqykXVx0A) thanks to
 mathematical and algorithmic advances together with the massive parallel processing power of modern GPUs.

GILT Automated dress faceting
<p align="center">
 <img src="http://i.imgur.com/DwOJMqT.png"/>
</p>


GILT Automated dress similarity
<p align="center">
 <img src="https://lh3.googleusercontent.com/MRGJeRWwyf8YXrnr4YLdJLS8X11VFAskS7K23OBwzF7PxqZCQcFPJaBY97b6O9HqN569FKLcANTlaJFPkAwcXKxtOeH0nXGOrfR70baCGOGAjowSR_-x6a7ZFgfaSGSzKEG6OodX3zrH1Cjgrs2iAk1EJmv1QXe9wdrftMsN45K6DweIerN6RupMGxIXeEwr8mFyb9ZEfvjcnWdgTQ-uWV1Nn3OwV6UdHH0nxzyG5Q0-NW37kJV8LXgwV_zQmqlUFOf5gpa0NckdO0kWnY589g1X8A7FUcpWhRcgMpBhf3sjla_5GeBVUJjVM4tHnymjIE65H-B45ptFbGx0B0AWbI-9yT_-wcHoaQKkg2lZjw8pk1IJ2l7RCOWuuzJphepdgtX4Wr4oR-unY5WB8VvMlX0sayQBwyCGu709R-3zp7TPv3yrG09RTdGkev5hqxu4Gcolt6kyAcIK5cKjMlERAvcNm8ILEJSZDzVXOOhT7GQmNhH3EOk1WZcTmcNVSLr06HaJFVHenhfSld84Wa-s_a_xf2Z_m_t7gt0EMK6kgU-WCIyDD07kts5K1RPT874VLJn5=w1790-h995-no"/>
</p>

# Deep Learning

Deep learning is based on what's called 'deep neural networks'. A [neural network](https://en.wikipedia.org/wiki/Artificial_neural_network) is
a sequence of numerical parameters that transform an input into an output. The input
can be the raw pixels in an image, and the output
can be the probability of that image to be of a specific type (for example, a dress with boat neckline).

To achieve the these results it's necessary to set the right numerical parameters to the network so it can make accurate predictions.
This process is called 'neural network training' and most times, involves different forms of a base algorithm called [backpropagation](https://en.wikipedia.org/wiki/Backpropagation).
The training is done using a set of inputs (e.g. images of dresses) and known output targets (e.g. the probability of each dress to be of a given silhouette) called the training set.
The training set is used by the backpropagation algorithm to change the network parameters. Given an input image, the backpropagation parameters change gets closer to the target. Iterating many times through backpropagation, the input can produce outputs very close to the target.

Once the training is done, if it has a high accuracy and the model is not affected by overfitting, whenever the network is fed with a brand new image,
it should be able to produce accurate predictions.

For example, say that we train a neural network to detect necklines in dresses using
a dataset of images of dresses with known necklines.
We'd expect that if the network parameters are properly set, when we feed the network with an image of a cowl neckline,
the output probability for the cowl neckline should be close to 1 (100% confidence).
The accuracy of the model can be computed using a set of inputs and expected targets called **test set**.
The test set is never used during training and thus it provides an objective view of how the network would
behave with new data.

Neural networks are structured in layers which are atomic forms of neural networks. Each layer gets as
an input the output of the previous layer, computes a new output with its numerical parameters and
feeds it forward into the next layer's input.
The first layers usually extract low level features in images such as edges, corners and curves.
The the deeper the layer is, the more high level features it extracts.
Deep neural networks have many layers, usually one stacked on top of the other.

Deep Neural Network Diagram
<p align="center">
  <img src="https://i.imgur.com/TGAKbuy.png"/>
</p>

# Dress Faceting

Automatic dress faceting is one of the new initiatives GILT is working on.
GILT is currently training deep neural networks to tag occasion, silhouette, neckline and sleeve type in dresses.

## Dress Faceting: The Model
The model used for training is [Facebook's open source Torch](https://github.com/facebook/fb.resnet.torch) implementation of [Microsoft's ResNet](https://arxiv.org/pdf/1512.03385v1).
Facebook's project is an image classifier, with models already trained in [ImageNet](http://image-net.org/).
We've added a few additional features to the original open source project:
- Selection of dataset for training and testing (silhouette, occasion, neckline...)
- Weighted loss for imbalanced datasets
- Inference given a file path of an image
- Store and load models in/from [AWS S3](https://aws.amazon.com/s3/)
- Automatic synchronization image labels with imported dataset
- Tolerance to corrupted or invalid images
- Custom ordering of labels
- Test and train [F1 Score](https://en.wikipedia.org/wiki/F1_score) accuracy computation for each class as well as individual predictions for each image across all tags.
- Spatial transformer attachment in existing networks

The models are trained in [GPU P2 EC2](https://aws.amazon.com/blogs/aws/new-p2-instance-type-for-amazon-ec2-up-to-16-gpus/) instances deployed using [Cloud Formation](https://aws.amazon.com/cloudformation/) and
attaching [EBS](https://aws.amazon.com/ebs/) to them. We plan to substitute
EBS by [EFS (Elastic File System)](https://aws.amazon.com/blogs/aws/amazon-elastic-file-system-production-ready-in-three-regions/) to be able to share data across many GPU instances.

We are also investing efforts trying to archive similar results using [TensorFlow](https://www.tensorflow.org/) and [GoogleNet v3](https://github.com/tensorflow/models/tree/master/inception).

## Dress Faceting: Data and Quality Management
To keep track of the results that our model is generating we've built a [Play](https://www.playframework.com/) web application to analyze results, keep a persistent dataset, and change the tags of the samples if we detect they are wrong.


### Model Accuracy Analysis
The most basic view to analyze machine learning results is the [F1 Score](https://en.wikipedia.org/wiki/F1_score), which provides
a good metric that takes into account both [false positive and false negative errors](https://en.wikipedia.org/wiki/False_positives_and_false_negatives).

On top of that, we provide a few views to be able to analyze results, specifically
intended to make sure samples are properly tagged.

F1 Score View
<p align="center">
  <img src="https://i.imgur.com/ZaYqprN.png"/>
</p>

### Image Tagging Refining
The accuracy analysis allows us to detect which are the images the model is struggling
to properly classify.
Often times, these images are mistagged and they have to be manually retagged and
the model retrained with the new test and training set. Once the model is retrained, very often its accuracy increases and it's possible to spot further mistagged images.

It's important to note here
that images in either the test or the training set always remain in test or in train.
It's only the tag that is changed: for example, a 'long sleeve' could be retagged to 'three-quarters sleeve'.

To scale the system we are attempting to automate the retagging using [Amazon Mechanical Turk](https://www.mturk.com/mturk/welcome).

False Negatives View
<p align="center">
  <img src="https://i.imgur.com/QXx0w07.png"/>
</p>

Image Tagging Refining Workflow
<p align="center">
  <img src="https://i.imgur.com/IbvG9ZM.png"/>
</p>

## Alternatives using SaaS

There are other alternatives to image tagging from SaaS companies. We've tried them without success. The problem with most of these platforms is that at this point in time they are not accurate nor detailed enough in regards of fashion tagging.

[Amazon Rekognition](https://aws.amazon.com/rekognition/) short sleeve dress image tagging results
<p align="center">
 <img src="https://i.imgur.com/EAg58Xz.png"/>
</p>

# Dress Similarity

Product similarity will allow us to be able to offer our customers recommendations based on product similarity. It'll also allow our customers to find visually similar product with other facets.

## Dress Similarity: The Model

For the machine learning model we are using [TiefVision](https://github.com/paucarre/tiefvision).

[TiefVision](https://github.com/paucarre/tiefvision) is based on reusing an existing already trained network to classify
on the [ImageNet](http://image-net.org/) dataset, and swapping
its last layers with a new network specialized for another purpose. This technique
is know as [transfer learning](http://cs231n.github.io/transfer-learning/).

The first trained networks are used to locate the dress in the image following Yann LeCun
[Overfeat paper](https://arxiv.org/pdf/1312.6229v4.pdf).
This location algorithm trains two networks using transfer learning:
- Background detection: detects background and foreground (dress) patches.
- Dress location network: locates a dress in an image given a patch
of a dress.

Combination of Dress Location and Background detection to accurately detect the Location of the dress
<p align="center">
  <img src="https://i.imgur.com/yufZKDn.png"/>
</p>

Once the dress is located, the next step is to detect whether two dresses are similar
or not. This can be done using unsupervised learning from the embeddings of the
output of one of the last layers. Another approach is to train a network for to learn dress similarity (supervised learning).

For the supervised side, we use Google's [DeepRank paper](http://users.eecs.northwestern.edu/~jwa368/pdfs/deep_ranking.pdf).
The supervised learning network uses as input three images: a reference dress, a dress similar to
the reference, and another dissimilar to the reference. Using a [siamese network](http://vision.ia.ac.cn/zh/senimar/reports/Siamese-Network-Architecture-and-Applications-in-Computer-Vision.pdf) and
training the network using a [Hinge loss](https://en.wikipedia.org/wiki/Hinge_loss) function, the network learns to
detect dress similarities.

Similarity Network Topology
<p align="center">
  <img src="https://i.imgur.com/9g9qltG.png"/>
</p>

To compute the similarity of a dress and the other dresses we have in our database
[TiefVision](https://github.com/paucarre/tiefvision) does the following two steps:
- The dress is first cropped using the location and background detection networks.
- Finally the dress similarity network computes the similarity between the cropped
dress and the cropped dresses we have in our database. It's also possible to compute
similarity using unsupervised learning.

For more information about [TiefVision](https://github.com/paucarre/tiefvision) you can take a look at [this presentation](https://docs.google.com/presentation/d/16hrXJhOzkbmla9AL7JCreCuBsa5L80gm71Pfrjo7F9Y/edit).

---
layout: post
title: "How to convert fully connected layers into equivalent convolutional ones"
author: Pau Carré Cardona
date: '2016-05-18'
categories: 
- deep learning
tags:
- deep learning
- convolutional neural networks
- image detection
- torch
- Pau Carré Cardona
redirect_to:
- https://tech.hbc.com/2016-05-18-fully-connected-to-convolutional-conversion.html
---

## The Problem

Say we want to build system to detect dresses in images using a deep convolutional network. What we have is a database of **64x128** pixels images that either fully contain a dress or another object (a tree, the sky, a building, a car...). With that data we train a deep convolutional network and we end up successfully with a high accuracy rate in the test set.


The problem comes when trying to detect dresses on arbitrarily large images. As images from cameras are usually far larger than **64x128** pixels, the output of the last convolutional layer will also be larger. Thus, the fully connected layer won’t be able to use it as the dimensions will be incompatible. This happens because a fully connected layer is a matrix multiplication and it’s not possible to multiply a matrix with vectors or matrices of arbitrary sizes.

Let’s assume we have **1024x512** pixels images taken from a camera. In order to detect dresses in an image, we would need to first forward it throughout the convolutional layers. This will work as convolutional layers can adapt to larger input sizes. Assuming the convolutional and max pool layers reduce the input dimensions by a factor of **32**, we would get an output of **32x16** units in the last convolutional layer. On the other hand, for the training and test images of **64x128** pixels, we would get an output of **2x4** units. That size of **2x4** units is the only one the fully connected layer matrix is compatible with.

Now the question is, how do we convert our camera **32x16** units into the fully connected **2x4** units ?

## The Wrong Solution

One way to do it is by simply generating all possible **2x4** crops from the **32x16** units. That means we would generate **403** samples of **2x4** units ( (32 - 2 + 1) x (16 - 4 + 1) = 403 ). Finally, we would go one by one forwarding those **403** samples throughout the fully connected layers and arrange them spatially.

The problem with that approach is that the cost of cropping and forwarding images throughout the fully connected layers can be impractical. On top of that, if the network reduction factor is lower or the camera images have a higher resolution, the number of samples will grow in a multiplicative way.

## The Right Solution

Fortunately, there is a way to convert a fully connected layer into a convolutional layer.
First off, we will have to define a topology for our fully connected layers and then convert one by one each fully connected layer. Let’s say we have a first fully connected layer with **4** units and a final single binary unit that outputs the probability of the image being a dress.
This diagram describes the topology:

<p align="center">
  <img src="http://i.imgur.com/yclyo3S.png"/>
</p>


### Converting the first fully connected layer

The idea here is to transform the matrix **A** into a convolutional layer. Doing that it’s pretty straightforward as the rows of the matrix **A** can be interpreted as convolutions applied to the flattened input **V**.

Let's first write down the classical deep learning convolution operator:

<p align="center">
  <img src="http://i.imgur.com/HMmxG23.png"/>
</p>

When both the signal and the filter are of the same size, the convolution will generate a vector of size one. Hence, the convolution will be equivalent to the dot product:

<p align="center">
  <img src="https://i.imgur.com/o67Atee.png"/>
</p>

Applying this property to our convolutional conversion task, we will be able to transform a linear operator into a vector of convolutions:

<p align="center">
  <img src="http://i.imgur.com/sWGZaAX.png"/>
</p>

Therefore, we have the following transformed convolutional layer for the first fully connected layer:

<p align="center">
  <img src="http://i.imgur.com/gkM8T2p.png"/>
</p>

More formally, we will have as many feature maps as rows the matrix **A** has. Furthermore, the **i**-th feature map will have as filter the **i**-th row of the matrix **A**.

Here we are assuming that the input of the fully connected layer is flattened and also that the fully connected layer only receives a single feature map from the last convolutional layer. For multidimensional convolutions with many feature maps, the transformation will depend on the way the framework we use encodes the different layer types (convolutional and fully connected).

In case of [Torch](http://torch.ch/), it’s pretty easy as one simply has to copy the biases and the weights of the fully connected layer into the convolutional layer. The caveat is that the convolutional layer has to be declared using the following parameters:

* **Number of input feature maps**: as many as output feature maps the last convolutional layer has.

* **Number of output feature maps**: number of outputs the fully connected layer has.

* **Filter dimensions**: the dimensions of the output of each feature map in the last convolutional layer (we assume the all of the feature maps have the same output dimensions).



### Converting the second fully connected layer

After the first transformation we will have in the second fully connected layer an input that has many feature maps of size one.

The equivalent convolutional layer will be the following:


* **Number of input feature maps**: as many input feature maps as output feature maps the last transformed convolutional layer has. It will also be equivalent to the input units the original second fully connected layer has.

* **Number of output feature maps**: as many output feature maps as outputs the second fully connected layer has. In our case we have a single output and therefore the layer will only have a single output feature map. In case we would have more outputs or an additional fully connected layer, we would need to add more feature maps.

* **Filter values**: the filter architecture is pretty simple as all the input feature maps have units of size one. This implies that the filters will be of size one. The value of the filter in the feature map that connects the **n**-th input unit with the **m**-th output unit will be equal to the element in the **n**-th column and the **m**-th row of the matrix **B**.
For our specific case there is one single output, thus **m** is equal to **1**. This makes the transformation even easier. Nevertheless, we should keep in mind that we could potentially have multiple outputs.

For our example, the second fully connected layer will be converted into the following convolutional layer:

<p align="center">
  <img src="http://i.imgur.com/IdIV2rs.png"/>
</p>

## Always be convolutional
In this post we've discussed how to transform fully connected layers into an equivalent convolutional layer. Once the network no longer has fully connected layers, we will be able to get rid of all the problems they cause when dealing with inputs of arbitrary sizes.

Nevertheless, when designing a new neural network from scratch it's always a good idea to design it substituting all fully connected layers with convolutional layers. This way, there is not only no need for any conversion but we will also get far more flexibility in our network architecture.

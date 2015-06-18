---
layout: post
title: Some Tips for Making Your Own 3D Printer
date: '2014-02-21T14:55:00-05:00'
tags:
- Andrey Kartashov
- Gilt
- Gilt Tech
- Gilt Groupe
- 3D printing
- 3D printer
- technology
- RepRap
- DIY
- K8200
- circlips
- OpenSCAD
- MakerBot
- thingiverse
- Repetier
- Slic3r
- ABS
- PLA
tumblr_url: http://tech.gilt.com/post/77403102016/some-tips-for-making-your-own-3d-printer
---


So, you want to get a 3D printer. Or you’re not sure that you want one, but maybe you do (3D printing is so cool!). Either way, there are lots of options (perhaps too many, even) to get started in the world of 3D printing. As ever, it depends on what you want:
Do you care at all about the machine, or just the printed objects themselves?
How much do you care about price?
 If you are like me, and are interested in the mechanics of the machine itself, creating a DIY 3D printer from scratch is a lot of fun. Implementations or adaptations of RepRap models are popular because they’re based on open source and open hardware, and their designs have been optimized for DIY and low-cost production. You can go with a kit, or completely build your own from parts—it’s up to you. Building your own can be cheaper, but only if you know what you are doing—which I didn''t—so I used a kit: the K8200, whose tagline is “the new 3D printer in town.” (This marketing language didn’t sway me in its direction—I simply chose this kit because it looked hackable and available at an approachable price point.)
 The hardest part of the assembly process was installing circlips without the right pair of pliers. Those little f*&#$$s are tough! In the end, I managed–but … just get the tool! I’ve taken my own advice on this point.
Mechanical calibration comes with some frustration as well. “Not too tight, not too loose, not too far, not too close,” seems to be the methodology to apply. If you break a part, then you’ve broken a real thing—i.e., you can’t ‘Git checkout’ to a previous version. (Luckily, I haven’t broken anything on my printer so far.) If you ever wonder what you get with a pre-assembled model, this is a big part. But if you are into mechanical stuff, the anxiety involved in trying not to break anything is fun in its own way.
Software:
This is the most complex part of it all. Luckily, even in the LINUX/open source world some good options exist:
Model design: If you write code for a living and ''traditional’ CAD GUIs and mesh modelers scare you, OpenSCAD might just be your thing. Its main benefits: you can write your own code, and you don’t have to use GUI. Of course, for the impatient, there’s always MakerBot’s thingiverse, where you can find lots of predesigned goodies.
Slicing/printing: RepRap firmware is supported by the Repetier/Slic3r combo. Both seem to work pretty well, although Repetier needs a lot of RAM for larger prints). At first, I used RepRap—but I’ve since written my own hack to feed generated G-Code to my printer. I’m still using Slic3r. 
PLAstic Fantastic
There are basically two kinds: PLA and ABS. ABS can be tougher but is a bit nastier to deal with. If you don’t care or are not sure what you need, try PLA first. The plastic I picked (from an unscientific online search) comes with a compatible filament diameter.
When working with plastic, it is very important for the heated bed to be level. It is also practically impossible with this particular model of the printer.  Solution: put a piece of glass on top of it. Mine is scavenged from an old laptop’s LCD. If you Google it, small mirrors are often suggested. If the first layer doesn’t stick well, you might as well stop the thing and figure that out, it’s not going to work anyway. This is why it’s important for the bed to be level and for the Z axis to be well calibrated and the right temperature to be set. However, when all the basics are covered and it still fails - a very thin layer of ''School glue’ makes prints stick perfectly and it’s easy to take off, it’s water-soluble.
Choosing a good extruder temperature is a bit of a trial and error. One observation: there’s a small kink on the heater’s time/temperature graph, at about the right point.  This is possibly due to a quick phase transition in the material (but this is just my speculation).
A final note: If you are mostly after the prints, and don’t want to spend much time with the machine, any of the popular commercial 3D-printer options will do. Just pick what is right in terms of features and price. Price will most likely end up becoming the deciding factor. Ask yourself if you want:
One print color, or more?
Auto-calibrated or not?
How big will your printed objects be?
Do you plan on using different plastic types?
Commercial printers are popping up like mushrooms these days, so you’ve got lots of options.
Since creating my printer, I’ve generated a few prints from Thingiverse and a couple of enclosures for my own projects.

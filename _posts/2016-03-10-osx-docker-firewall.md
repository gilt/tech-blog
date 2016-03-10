---
layout: post
title: "OSX, Docker, NFS and packet filter firewall"
author: Andrey Kartashov
category: docker
tags:
- docker
- osx
- nfs
- firewall
---

Mobile services team at Gilt uses Docker to both, build and run software.

In addition to the usual Docker benefits for software deployments moving toolchains to Docker has a few advantages:

- it's easy to (re)create a development environment
- environment is preserved in a stable binary form (libs, configs, CLI tools, etc, etc don't bit rot as main OS packages or OS itself evolve)
- easy to support multiple divergent environments where different versions of tools/libs are the default, e.g. java7/8, python, ruby, scala, etc

We mostly develop on OSX, Docker is a Linux-specific tool, so we use docker-machine and VirtualBox to actually run it.
To run toolchains we rely on having access to the host OS's filesystem, by default /Users is exposed in the Docker VM.
Unfortunately, default setup uses VBOXFS which is very slow. This can be really painful when building larger projects or relying on build steps that require a lot of IO, like [sbt-assembly](https://github.com/sbt/sbt-assembly) plugin.

Here's a great [comparison of IO performance](http://mitchellh.com/comparing-filesystem-performance-in-virtual-machines).

There's really no good solution for this problem at the moment but some folks have come up with a reasonable hack: use NFS.

One of them was even nice enough to wrap it up into a [shell script](https://github.com/adlogix/docker-machine-nfs) that "just works".


Indeed, with NFS enabled project build times begin to approach "native" speeds, so it's tempting.
One issue with it though is that NFS is a very old system, designed to work in trusted network environments, access is given to hosts, not authenticated users.
While this is a reasonable access model for secure production networks it's hard to guarantee anything about random networks you may have to connect to with your laptop, having /Users exposed via NFS on un-trusted networks is a scary prospect.


OSX has not one but two built-in firewalls.
There's a simplified app-centric firewall available from Preferences panel.
Unfortunately all it can do is either block all nfs traffic (docker VM can't access your exported file system) or open up nfs traffic on all interfaces (insecure), so, it doesn't really work for this case.

Fortunately, under the hood there's also a much more flexible built-in packet level firewall that can be configured.
It's called PF (packet filter) and its main CLI tool is pfctl.
Here's a nice [intro](https://pleiades.ucsc.edu/hyades/PF_on_Mac_OS_X).

With that, one possible solution is to disable firewall in the Preferences panel and add this section at the end of the /etc/pf.conf file instead:

```
# Do not filter anything on private interfaces
set skip on lo0
set skip on vboxnet0
set skip on vboxnet1

# Allow all traffic between host and docker VM
table <docker> const { 192.168.99/24 }
docker_if = "{" bridge0  vboxnet0  vboxnet1 "}"
pass quick on $docker_if inet proto icmp from <docker> to <docker>
pass quick on $docker_if inet proto udp from <docker> to <docker> keep state
pass quick on $docker_if inet proto tcp from <docker> to <docker> keep state

# Allow icmp
pass in quick inet  proto icmp
pass in quick inet6 proto ipv6-icmp

# Bonjour
pass in quick proto udp from any to any port 5353

# DHCP Client
pass in quick proto udp from any to any port 68

# Block all incoming traffic by default
block drop in
pass out quick
```

Then turn it on at a system boot time by adding /Library/LaunchDaemons/com.yourcompany.pfctl.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Disabled</key>
	<false/>
	<key>Label</key>
	<string>com.gilt.pfctl</string>
	<key>WorkingDirectory</key>
	<string>/var/run</string>
	<key>Program</key>
	<string>/sbin/pfctl</string>
	<key>ProgramArguments</key>
	<array>
		<string>pfctl</string>
		<string>-E</string>
		<string>-f</string>
		<string>/etc/pf.conf</string>
	</array>
	<key>RunAtLoad</key>
	<true/>
</dict>
</plist>
```

and configuring it to start by running

```sh
sudo launchctl load -w /Library/LaunchDaemons/com.yourcompany.pfctl.plist
```

The main difference from /System/Library/LaunchDaemons/com.apple.pfctl.plist here is the addition of -E parameter.

You can check that it starts by default after a reboot with

```sh
sudo pfctl -s info
```

and check the rules with

```sh
sudo pfctl -s rules
```

It should be 'Enabled' and you should see the configured rules.

You can verify your overall setup by running nmap from a different node against your laptop, e.g.

```sh
sudo nmap -P0 -sU  YOUR_IP
sudo nmap -P0 -sT  YOUR_IP
```

and check for open ports.

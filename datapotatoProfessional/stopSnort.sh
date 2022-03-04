#!/bin/bash
for id in $(pgrep snort)
do
	echo $id
	sudo kill -INT $id
done
sudo snort -A console -q -c /etc/snort/snort.conf -i ens5 > logs.txt

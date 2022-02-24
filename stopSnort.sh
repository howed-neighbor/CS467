#!/bin/bash
for id in $(pgrep snort)
do
	echo $id
	sudo kill -INT $id
done

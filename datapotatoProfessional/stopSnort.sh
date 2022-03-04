#!/bin/bash
for id in $(pgrep snort)
do
	sudo kill -INT $(pgrep snort)
done

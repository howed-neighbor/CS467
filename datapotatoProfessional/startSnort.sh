#!/bin/bash
rm -rf logs.txt
sudo snort -A console -q -c /etc/snort/snort.conf -i ens5 > logs.txt

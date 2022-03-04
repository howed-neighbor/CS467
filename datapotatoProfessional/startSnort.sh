#!/bin/bash
sudo snort -A console -q -c /etc/snort/snort.conf -i ens5 1>>./logs.txt

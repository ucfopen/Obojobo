#!/bin/bash
HOME_PATH=$PWD
for d in ./packages/*/*
do
	echo "=================="
	basename "$d"
	echo "=================="
	cd "$HOME_PATH"
	cd "$d"
	$@
done

#!/bin/bash
HOME_PATH=$PWD
RETURN_CODE=0

for d in ./packages/*/*; do
	echo ""
	echo "===================================="
	basename "$d"
	echo "===================================="
	cd "$HOME_PATH"
	cd "$d"
	eval "$@";

	# store the command's return status
	RET=$?
	if [ $RET != 0 ]; then
		RETURN_CODE=RET
	fi
done

exit $RETURN_CODE

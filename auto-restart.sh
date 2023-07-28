#!/bin/bash

RED='\033[0;31m'
STOP='\033[0m'

# Auto restarts the bot when it crashes
while true; do
	git pull
	node ./main.js
	echo -e "${RED}	MERLIN - Auto-restart ${STOP} \n"
done
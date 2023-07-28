#!/bin/bash

# Auto restarts the bot when it crashes
while true; do
	git pull
	node ./main.js
	echo "\033[0;31m // Auto-restart //"
done
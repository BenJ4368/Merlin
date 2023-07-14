#!/bin/bash

# Auto restarts the bot when it crashes
while true; do
  node ./main.js
  echo "Merlin died. Reanimation..."
done
#!/bin/bash

set -e

# Initialize npm project with default values
npm init -y

# Install TypeScript as a dev dependency
npm install --save-dev typescript

# Generate tsconfig.json with default settings
npx tsc --init

echo "TypeScript project initialized."

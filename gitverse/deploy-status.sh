#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI could not be found. Please install it with 'npm i -g vercel'."
    exit 1
fi

echo "Checking latest deployment status for Gitverse..."
vercel list --limit 1

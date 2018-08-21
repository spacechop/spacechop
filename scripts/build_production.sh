#!/bin/sh
echo "Building for production..."
npm run build
npm prune --production
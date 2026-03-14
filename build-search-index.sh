#!/bin/bash

# Build search index for development
echo "Building search index for development..."

# Build the site
hugo --quiet

# Copy index.json to static folder for dev server
if [ -f "public/index.json" ]; then
    mkdir -p static
    cp public/index.json static/index.json
    echo "✓ Search index copied to static/index.json"
    echo "  You can now run 'hugo server' and search will work"
else
    echo "✗ index.json not found in public folder"
fi
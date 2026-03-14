# Search Functionality

## Production
Search works automatically in production at `https://surendrakatla-sfohana.github.io/sf-ohana/search/`

## Development Limitation
Due to Hugo's development server limitations, the search index (index.json) may not load properly in `hugo server` mode. This is a known Hugo issue where the dev server doesn't serve generated JSON files.

### Workaround for Development
1. Build the site first: `hugo`
2. Copy index.json to static: `cp public/index.json static/`
3. Or use the provided script: `./build-search-index.sh`
4. Run the server: `hugo server`

Note: Even with this workaround, Hugo server may still not serve the JSON file. Search will always work in production.

### Alternative for Testing Search
Test the search functionality by building and serving locally:
```bash
hugo
cd public
python3 -m http.server 8000
# Visit http://localhost:8000/search/
```
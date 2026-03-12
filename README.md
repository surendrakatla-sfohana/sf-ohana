# SF Ohana - Salesforce Knowledge Base

A modern, responsive Hugo-based knowledge base for Salesforce technical documentation. Built with a custom theme optimized for developer documentation and daily knowledge management.

## 🚀 Features

- **Modern Design**: Clean, Salesforce-inspired UI with responsive layout
- **Topic-Based Organization**: Structured content areas for different Salesforce technologies
- **Fast Search**: Client-side search functionality for instant results
- **Mobile Friendly**: Fully responsive design with mobile navigation
- **Syntax Highlighting**: Beautiful code blocks with language-specific highlighting
- **GitHub Pages Ready**: Pre-configured for easy deployment

## 📁 Project Structure

```
sf-ohana/
├── content/                 # Your markdown content
│   ├── apex/               # Apex documentation
│   ├── lwc/                # Lightning Web Components
│   ├── platform-events/    # Platform Events
│   └── ...                 # Other topics
├── themes/
│   └── sf-ohana-theme/     # Custom theme
│       ├── layouts/        # HTML templates
│       ├── static/         # CSS, JS, images
│       └── ...
├── hugo.toml               # Hugo configuration
└── .github/
    └── workflows/
        └── hugo.yml        # GitHub Actions deployment
```

## 🛠 Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (v0.120.0 or later)
- Git
- GitHub account (for GitHub Pages deployment)

## 🏁 Quick Start

### 1. Install Hugo

**macOS:**
```bash
brew install hugo
```

**Windows:**
```bash
choco install hugo-extended
```

**Linux:**
```bash
snap install hugo
```

### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/sf-ohana.git
cd sf-ohana
```

### 3. Run Locally

```bash
hugo server -D
```

Visit `http://localhost:1313` to see your site.

## 📝 Adding Content

### Create a New Topic Section

```bash
hugo new content/your-topic/_index.md
```

### Add a Page to a Topic

```bash
hugo new content/apex/your-page-title.md
```

### Content Front Matter

```yaml
---
title: "Your Page Title"
description: "Brief description of the page"
date: 2024-01-01
tags: ["apex", "triggers", "best-practices"]
---
```

## 🎨 Customization

### Modify Theme Colors

Edit `themes/sf-ohana-theme/static/css/main.css`:

```css
:root {
    --color-primary: #0176D3;
    --color-secondary: #1B96FF;
    /* Modify other colors as needed */
}
```

### Add New Topics

Edit `hugo.toml`:

```toml
[[params.topics]]
    name = "Your Topic"
    url = "/your-topic/"
    icon = "icon-name"
    description = "Topic description"
```

## 🚀 Deployment to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/sf-ohana.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to Settings → Pages in your repository
   - Source: GitHub Actions
   - The workflow will automatically deploy on push to main

3. **Update Base URL**
   - Edit `hugo.toml`:
   ```toml
   baseURL = "https://yourusername.github.io/sf-ohana/"
   ```

4. **Push Changes**
   ```bash
   git add .
   git commit -m "Update base URL"
   git push
   ```

Your site will be available at `https://yourusername.github.io/sf-ohana/`

### Method 2: Manual Deployment

1. **Build the Site**
   ```bash
   hugo --minify
   ```

2. **Create gh-pages Branch**
   ```bash
   git checkout -b gh-pages
   git add -f public
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

3. **Configure GitHub Pages**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

## 🔧 Development Workflow

### Daily Content Addition

1. **Create new content file**
   ```bash
   hugo new content/apex/new-feature.md
   ```

2. **Edit in your favorite editor**
   ```bash
   code content/apex/new-feature.md
   ```

3. **Preview locally**
   ```bash
   hugo server -D
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Add new-feature documentation"
   git push
   ```

### Content Organization Best Practices

- Keep file names lowercase with hyphens
- Use clear, descriptive titles
- Add relevant tags for better search
- Include code examples where applicable
- Update section indexes regularly

## 📚 Content Guidelines

### Markdown Features

- **Code Blocks**: Use triple backticks with language specification
  ````markdown
  ```apex
  public class MyClass {
      // Code here
  }
  ```
  ````

- **Tables**: Standard markdown tables are supported
- **Alerts**: Use blockquotes for important notes
  ```markdown
  > **Note:** Important information here
  ```

### File Naming Convention

- Use lowercase letters
- Separate words with hyphens
- Be descriptive but concise
- Examples:
  - `trigger-best-practices.md`
  - `async-apex-patterns.md`
  - `lwc-lifecycle-hooks.md`

## 🔍 Search Configuration

The site includes client-side search. To ensure content is searchable:

1. Content is automatically indexed during build
2. Search works across titles, content, and tags
3. Results are ranked by relevance

## 🐛 Troubleshooting

### Common Issues

**Hugo command not found**
- Ensure Hugo is in your PATH
- Restart terminal after installation

**Theme not loading**
- Check theme name in `hugo.toml` matches folder name
- Ensure theme files are in correct structure

**GitHub Pages not updating**
- Check Actions tab for build errors
- Ensure workflow has correct permissions
- Verify base URL matches your GitHub Pages URL

**Search not working**
- Ensure JSON output is enabled in `hugo.toml`
- Check browser console for JavaScript errors
- Verify search index is being generated

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📮 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions

## 🎯 Roadmap

- [ ] Add dark mode toggle
- [ ] Implement version control for content
- [ ] Add PDF export functionality
- [ ] Create interactive code playgrounds
- [ ] Add multi-language support
- [ ] Implement content analytics

## 🙏 Acknowledgments

- Built with [Hugo](https://gohugo.io/)
- Inspired by Salesforce Developer Documentation
- Icons from various open-source projects

---

**SF Ohana** - Building a stronger Salesforce community through shared knowledge.

Last updated: 2024

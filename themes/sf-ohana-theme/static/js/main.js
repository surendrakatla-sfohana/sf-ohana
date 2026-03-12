// Main JavaScript file for SF Ohana theme

document.addEventListener('DOMContentLoaded', function() {
    // Copy code to clipboard functionality
    addCopyButtons();

    // External link handling
    handleExternalLinks();

    // Add reading progress indicator
    addReadingProgress();

    // Initialize tooltips
    initializeTooltips();

    // Lazy load images
    lazyLoadImages();
});

// Add copy buttons to code blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach(block => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 4px 12px;
            background: rgba(255, 255, 255, 0.1);
            color: #f8f8f2;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        `;

        // Make the pre element relative positioned
        block.style.position = 'relative';

        // Add hover effect
        copyButton.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });

        copyButton.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        // Copy functionality
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code') || block;
            const text = code.textContent;

            navigator.clipboard.writeText(text).then(() => {
                copyButton.textContent = 'Copied!';
                copyButton.style.background = '#2e844a';

                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                copyButton.textContent = 'Failed';
                copyButton.style.background = '#ea001e';

                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 2000);
            });
        });

        block.appendChild(copyButton);
    });
}

// Handle external links
function handleExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(link => {
        if (!link.hostname === window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');

            // Add external link icon
            if (!link.querySelector('.external-icon')) {
                const icon = document.createElement('span');
                icon.className = 'external-icon';
                icon.innerHTML = ' ↗';
                icon.style.fontSize = '0.8em';
                link.appendChild(icon);
            }
        }
    });
}

// Add reading progress indicator
function addReadingProgress() {
    const article = document.querySelector('.article-content');
    if (!article) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #0176D3, #1B96FF);
        width: 0%;
        z-index: 1001;
        transition: width 0.2s ease;
    `;

    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const progress = (scrollTop / (documentHeight - windowHeight)) * 100;

        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// Initialize tooltips
function initializeTooltips() {
    const elementsWithTitle = document.querySelectorAll('[title]');

    elementsWithTitle.forEach(element => {
        const title = element.getAttribute('title');
        element.removeAttribute('title');
        element.setAttribute('data-tooltip', title);

        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = title;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;

            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;

            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);

            element.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.remove();
                }, 200);
            }, { once: true });
        });
    });
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press '/' to focus search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const searchInput = document.getElementById('search-input');
        if (searchInput && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    }

    // Press 'Escape' to close mobile menu or sidebar
    if (e.key === 'Escape') {
        const mobileNav = document.querySelector('.mobile-nav.active');
        const mobileSidebar = document.querySelector('.sidebar.mobile-visible');

        if (mobileNav) {
            mobileNav.classList.remove('active');
        }

        if (mobileSidebar) {
            mobileSidebar.classList.remove('mobile-visible');
        }
    }
});

// Smooth fade-in animation for content
window.addEventListener('load', function() {
    const content = document.querySelector('.main-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 100);
    }
});

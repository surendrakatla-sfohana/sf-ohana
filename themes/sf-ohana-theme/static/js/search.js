// Search functionality for SF Ohana theme

(function() {
    'use strict';

    // Initialize search when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeSearch);

    function initializeSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');

        if (!searchInput) return;

        // Load search index
        let searchIndex = null;
        let fuse = null;

        // Fetch the search index
        fetch('/index.json')
            .then(response => response.json())
            .then(data => {
                searchIndex = data;
                // Initialize Fuse.js for fuzzy search
                fuse = new Fuse(searchIndex, {
                    keys: [
                        { name: 'title', weight: 0.8 },
                        { name: 'content', weight: 0.5 },
                        { name: 'tags', weight: 0.3 },
                        { name: 'categories', weight: 0.3 }
                    ],
                    includeScore: true,
                    threshold: 0.3,
                    location: 0,
                    distance: 100,
                    minMatchCharLength: 2
                });
            })
            .catch(error => {
                console.error('Error loading search index:', error);
            });

        // Search event handlers
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Live search as user types (debounced)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });

        // Perform search
        function performSearch() {
            const query = searchInput.value.trim();

            if (!query) {
                clearResults();
                return;
            }

            if (!fuse) {
                showMessage('Search index is still loading...');
                return;
            }

            const results = fuse.search(query);
            displayResults(results);
        }

        // Display search results
        function displayResults(results) {
            const resultsContainer = document.getElementById('search-results');
            const noResultsContainer = document.getElementById('search-no-results');

            if (!resultsContainer) return;

            if (results.length === 0) {
                resultsContainer.innerHTML = '';
                if (noResultsContainer) {
                    noResultsContainer.style.display = 'block';
                }
                return;
            }

            if (noResultsContainer) {
                noResultsContainer.style.display = 'none';
            }

            let html = '<div class="results-list">';
            html += `<div class="results-count">Found ${results.length} result${results.length !== 1 ? 's' : ''}</div>`;

            results.forEach(result => {
                const item = result.item;
                const score = Math.round((1 - result.score) * 100);

                html += `
                    <article class="result-item">
                        <div class="result-score" title="Relevance: ${score}%">
                            <div class="score-bar" style="width: ${score}%"></div>
                        </div>
                        <h3 class="result-title">
                            <a href="${item.permalink}">${highlightText(item.title, searchInput.value)}</a>
                        </h3>
                        <p class="result-summary">${highlightText(truncateText(item.content, 200), searchInput.value)}</p>
                        <div class="result-meta">
                            <span class="result-section">${item.section || 'General'}</span>
                            ${item.date ? `<time class="result-date">${formatDate(item.date)}</time>` : ''}
                        </div>
                    </article>
                `;
            });

            html += '</div>';
            resultsContainer.innerHTML = html;

            // Add animation to results
            animateResults();
        }

        // Clear search results
        function clearResults() {
            const resultsContainer = document.getElementById('search-results');
            const noResultsContainer = document.getElementById('search-no-results');

            if (resultsContainer) {
                resultsContainer.innerHTML = '';
            }

            if (noResultsContainer) {
                noResultsContainer.style.display = 'none';
            }
        }

        // Show message
        function showMessage(message) {
            const resultsContainer = document.getElementById('search-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = `<div class="search-message">${message}</div>`;
            }
        }

        // Highlight search terms in text
        function highlightText(text, query) {
            if (!query) return text;

            const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }

        // Escape regex special characters
        function escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        // Truncate text to specified length
        function truncateText(text, maxLength) {
            if (text.length <= maxLength) return text;
            return text.substr(0, maxLength).trim() + '...';
        }

        // Format date
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        // Animate search results
        function animateResults() {
            const results = document.querySelectorAll('.result-item');
            results.forEach((result, index) => {
                result.style.opacity = '0';
                result.style.transform = 'translateY(10px)';
                result.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                setTimeout(() => {
                    result.style.opacity = '1';
                    result.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }

        // Quick search modal
        createQuickSearchModal();
    }

    // Create quick search modal
    function createQuickSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'quick-search-modal';
        modal.innerHTML = `
            <div class="quick-search-content">
                <input type="text" class="quick-search-input" placeholder="Quick search... (Press '/' to open)">
                <div class="quick-search-results"></div>
            </div>
        `;
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            backdrop-filter: blur(4px);
        `;

        document.body.appendChild(modal);

        // Quick search styling
        const style = document.createElement('style');
        style.textContent = `
            .quick-search-content {
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 600px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }

            .quick-search-input {
                width: 100%;
                padding: 20px;
                font-size: 18px;
                border: none;
                border-bottom: 1px solid #eee;
                outline: none;
            }

            .quick-search-results {
                max-height: 400px;
                overflow-y: auto;
                padding: 10px;
            }

            .result-score {
                height: 4px;
                background: #f0f0f0;
                border-radius: 2px;
                margin-bottom: 8px;
                overflow: hidden;
            }

            .score-bar {
                height: 100%;
                background: linear-gradient(90deg, #0176D3, #1B96FF);
                border-radius: 2px;
                transition: width 0.3s ease;
            }

            mark {
                background: #ffe066;
                padding: 2px 4px;
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);

        // Modal event handlers
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeQuickSearch();
            }
        });

        const quickSearchInput = modal.querySelector('.quick-search-input');
        quickSearchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeQuickSearch();
            }
        });

        // Open/close functions
        window.openQuickSearch = function() {
            modal.style.display = 'block';
            quickSearchInput.focus();
        };

        window.closeQuickSearch = function() {
            modal.style.display = 'none';
            quickSearchInput.value = '';
            modal.querySelector('.quick-search-results').innerHTML = '';
        };
    }

    // Fallback if Fuse.js is not loaded
    if (typeof Fuse === 'undefined') {
        // Simple search implementation
        window.Fuse = function(data, options) {
            this.data = data;
            this.options = options;

            this.search = function(query) {
                const lowerQuery = query.toLowerCase();
                return this.data
                    .filter(item => {
                        const titleMatch = item.title && item.title.toLowerCase().includes(lowerQuery);
                        const contentMatch = item.content && item.content.toLowerCase().includes(lowerQuery);
                        return titleMatch || contentMatch;
                    })
                    .map(item => ({ item: item, score: 0 }));
            };
        };
    }
})();

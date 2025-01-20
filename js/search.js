class BlogSearch {
    constructor() {
        this.searchIndex = [];
        this.initializeSearch();
    }

    async initializeSearch() {
        try {
            // Load all blog posts metadata
            const response = await fetch('/api/posts.json');
            const posts = await response.json();
            this.searchIndex = posts.map(post => ({
                ...post,
                searchText: `${post.title} ${post.content} ${post.tags.join(' ')}`.toLowerCase()
            }));
        } catch (error) {
            console.error('Error initializing search:', error);
        }
    }

    search(query) {
        const searchTerms = query.toLowerCase().split(' ');
        return this.searchIndex.filter(post =>
            searchTerms.every(term => post.searchText.includes(term))
        );
    }

    renderSearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = results.map(post => `
            <div class="search-result-card">
                <h3><a href="${post.url}">${post.title}</a></h3>
                <div class="result-meta">
                    <span>${post.category}</span>
                    <span>${post.date}</span>
                </div>
                <p>${post.excerpt}</p>
                <div class="result-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
}

// Initialize search
const blogSearch = new BlogSearch();

// Add search event listener
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.length >= 3) {
        const results = blogSearch.search(query);
        blogSearch.renderSearchResults(results);
    }
});
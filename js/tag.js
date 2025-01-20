class TagSystem {
    constructor() {
        this.tags = new Set();
        this.initializeTags();
    }

    async initializeTags() {
        try {
            const response = await fetch('/api/tags.json');
            const tags = await response.json();
            this.tags = new Set(tags);
            this.renderTagCloud();
        } catch (error) {
            console.error('Error initializing tags:', error);
        }
    }

    renderTagCloud() {
        const tagCloud = document.getElementById('tag-cloud');
        tagCloud.innerHTML = Array.from(this.tags).map(tag => `
            <a href="/tags/${tag}" class="tag-link" data-tag="${tag}">
                ${tag}
            </a>
        `).join('');
    }

    filterByTag(tag) {
        const posts = document.querySelectorAll('.blog-card');
        posts.forEach(post => {
            const postTags = post.dataset.tags.split(',');
            post.style.display = postTags.includes(tag) ? 'block' : 'none';
        });
    }
}

// Initialize tag system
const tagSystem = new TagSystem();

// Add tag click handlers
document.querySelectorAll('.tag-link').forEach(tag => {
    tag.addEventListener('click', (e) => {
        e.preventDefault();
        const tagName = e.target.dataset.tag;
        tagSystem.filterByTag(tagName);
    });
});
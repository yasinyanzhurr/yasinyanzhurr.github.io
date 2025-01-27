/**
 * @file: article.js
 * @description: Modul untuk menangani halaman artikel
 * @author: yyanzhur
 * @created: 2025-01-27 17:22:49
 * @last-modified: Auto-updated on save
 */



export function initializeArticle() {
    const articleManager = new ArticleManager();
    articleManager.initialize();
}

class ArticleManager {
    constructor() {
        this.currentPath = window.location.pathname;
        this.articleId = this.getArticleIdFromPath();
    }

    initialize() {
        this.setupSidebar();
        this.highlightCurrentPage();
        this.loadArticleContent();
        this.setupQuizIfExists();
    }

    getArticleIdFromPath() {
        const pathParts = this.currentPath.split('/');
        return pathParts[pathParts.length - 2] || '';
    }

    setupSidebar() {
        // Highlight active menu item
        const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
        sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === this.currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    highlightCurrentPage() {
        const breadcrumbItems = document.querySelectorAll('.breadcrumb-item');
        if (breadcrumbItems.length > 0) {
            breadcrumbItems[breadcrumbItems.length - 1].classList.add('active');
        }
    }

    async loadArticleContent() {
        try {
            // Jika ada konten yang perlu dimuat secara dinamis
            const contentContainer = document.querySelector('.article-content');
            if (!contentContainer) return;

            const response = await fetch(`/api/articles/content/${this.articleId}.json`);
            if (!response.ok) throw new Error('Konten tidak ditemukan');

            const data = await response.json();
            this.renderArticleContent(data);
        } catch (error) {
            console.error('Error loading article content:', error);
            this.showError('Gagal memuat konten artikel');
        }
    }

    setupQuizIfExists() {
        const quizContainer = document.querySelector('.quiz-container');
        if (!quizContainer) return;

        // Load and initialize quiz if exists
        const quizPath = quizContainer.dataset.quizPath;
        if (quizPath) {
            this.loadQuiz(quizPath);
        }
    }

    async loadQuiz(quizPath) {
        try {
            const response = await fetch(quizPath);
            if (!response.ok) throw new Error('Quiz tidak ditemukan');

            const quizData = await response.json();
            this.initializeQuiz(quizData);
        } catch (error) {
            console.error('Error loading quiz:', error);
            this.showError('Gagal memuat quiz');
        }
    }

    showError(message) {
        const container = document.querySelector('main');
        if (container) {
            container.innerHTML += `
                <div class="alert alert-danger">
                    <h4>Error</h4>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn btn-outline-danger btn-sm">
                        Coba Lagi
                    </button>
                </div>
            `;
        }
    }
}

// Export class juga untuk penggunaan langsung jika diperlukan
export { ArticleManager };
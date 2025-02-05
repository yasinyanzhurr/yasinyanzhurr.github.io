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
        // this.setupQuizIfExists();
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

    // async loadArticleContent() {
    //     try {
    //         // Jika ada konten yang perlu dimuat secara dinamis
    //         const contentContainer = document.querySelector('.article-content');
    //         if (!contentContainer) return;

    //         const response = await fetch(`/api/articles/content/${this.articleId}.json`);
    //         if (!response.ok) throw new Error('Konten tidak ditemukan');

    //         const data = await response.json();
    //         this.renderArticleContent(data);
    //     } catch (error) {
    //         console.error('Error loading article content:', error);
    //         this.showError('Gagal memuat konten artikel');
    //     }
    // }



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

// Tambahkan event listener saat dokumen dimuat
// animations.js
// Tunggu sampai dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Ambil referensi button
    const button = document.getElementById('showAnswerBtn');
    const answersDiv = document.getElementById('answers');

    // Tambahkan event listener ke button
    if (button) {
        button.addEventListener('click', () => {
            if (answersDiv.style.display === 'none') {
                // Tampilkan jawaban
                answersDiv.style.display = 'block';
                answersDiv.style.opacity = '0';
                
                // Animasi fade in
                setTimeout(() => {
                    answersDiv.style.transition = 'opacity 0.3s ease';
                    answersDiv.style.opacity = '1';
                }, 10);
                
                // Ubah tombol
                button.textContent = 'Sembunyikan Jawaban';
                button.classList.remove('btn-primary');
                button.classList.add('btn-secondary');
            } else {
                // Animasi fade out
                answersDiv.style.opacity = '0';
                
                // Sembunyikan setelah animasi selesai
                setTimeout(() => {
                    answersDiv.style.display = 'none';
                }, 300);
                
                // Kembalikan tombol
                button.textContent = 'Lihat Jawaban';
                button.classList.remove('btn-secondary');
                button.classList.add('btn-primary');
            }
        });
    }
});






// Tambahkan animasi scroll
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe semua elemen dengan class animate-on-scroll
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
});


// Export class juga untuk penggunaan langsung jika diperlukan
export { ArticleManager };
/**
 * category.js
 * File untuk mengatur tampilan halaman kategori
 * 
 * @author: yyanzhur
 * @created: 2025-01-26 14:23:59
 */

class CategoryManager {
    constructor() {
        this.categoryId = this.getCategoryFromUrl();
    }

    // Mendapatkan nama kategori dari URL
    getCategoryFromUrl() {
        const path = window.location.pathname.split('/');
        return path[1] || 'matematika'; // Default ke matematika jika tidak ada
    }

    // Memuat data kategori
    async loadCategoryData() {
        try {
            const response = await fetch(`/api/categories/${this.categoryId}.json`);
            if (!response.ok) throw new Error('Kategori tidak ditemukan');
            return await response.json();
        } catch (error) {
            console.error('Error loading category:', error);
            this.showError('Gagal memuat data kategori');
        }
    }

    // Memuat artikel terbaru
    async loadLatestArticles() {
        try {
            const response = await fetch(`/api/articles/${this.categoryId}/latest.json`);
            if (!response.ok) throw new Error('Artikel tidak ditemukan');
            return await response.json();
        } catch (error) {
            console.error('Error loading articles:', error);
            return { articles: [] };
        }
    }

    // Render halaman kategori
    async renderCategory() {
        const data = await this.loadCategoryData();
        if (!data) return;

        this.updatePageTitle(data);
        this.renderHeroSection(data);
        this.renderSubCategories(data.subCategories);
        this.renderStats(data.stats);
        
        const articles = await this.loadLatestArticles();
        this.renderLatestArticles(articles.articles);
    }

    // Update judul halaman
    updatePageTitle(data) {
        document.title = `${data.title} - Platform Pembelajaran`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = data.description;
    }

    // Render bagian hero
    renderHeroSection(data) {
        const hero = document.getElementById('categoryHero');
        if (hero) {
            hero.style.backgroundImage = `url(${data.background})`;
            hero.innerHTML = `
                <div class="container">
                    <div class="hero-content text-center py-5" data-aos="fade-up">
                        <h1>${data.title}</h1>
                        <p class="lead">${data.description}</p>
                    </div>
                </div>
            `;
        }
    }

    // Render sub kategori
    renderSubCategories(subCategories) {
        const container = document.getElementById('subCategoriesContainer');
        if (!container) return;

        container.innerHTML = subCategories.map(sub => `
            <div class="col-md-6 col-lg-3 mb-4" data-aos="fade-up">
                <div class="card category-card h-100">
                    <div class="card-body text-center">
                        <i class="bi ${sub.icon} category-icon text-${sub.color}"></i>
                        <h3 class="card-title h5">${sub.title}</h3>
                        <p class="card-text small">${sub.description}</p>
                        <div class="mt-3">
                            <span class="badge bg-${sub.color} mb-2">
                                ${sub.totalArticles} Artikel
                            </span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <a href="${this.categoryId}/${sub.id}/" 
                           class="btn btn-${sub.color}">
                            Lihat Materi
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render artikel terbaru
    renderLatestArticles(articles) {
        const container = document.getElementById('latestArticlesContainer');
        if (!container) return;

        container.innerHTML = articles.map(article => `
            <div class="col-md-6" data-aos="fade-up">
                <div class="card article-card h-100">
                    <img src="${article.image}" 
                         class="card-img-top" 
                         alt="${article.title}">
                    <div class="card-body">
                        <div class="mb-2">
                            <span class="badge bg-primary">${article.subcategory}</span>
                            <span class="badge bg-secondary">${article.duration}</span>
                        </div>
                        <h3 class="card-title h5">${article.title}</h3>
                        <p class="card-text small">${article.excerpt}</p>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="bi bi-calendar"></i> ${article.date}
                            </small>
                            <a href="${article.url}" class="btn btn-link px-0">
                                Baca Selengkapnya
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render statistik
    renderStats(stats) {
        const container = document.getElementById('statsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="row text-center">
                <div class="col-4">
                    <div class="stat-number">${stats.totalArticles}</div>
                    <div class="stat-label">Artikel</div>
                </div>
                <div class="col-4">
                    <div class="stat-number">${stats.totalStudents}</div>
                    <div class="stat-label">Siswa</div>
                </div>
                <div class="col-4">
                    <div class="stat-number">${stats.totalExercises}</div>
                    <div class="stat-label">Latihan</div>
                </div>
            </div>
        `;
    }

    // Tampilkan pesan error
    showError(message) {
        const container = document.querySelector('main');
        if (container) {
            container.innerHTML = `
                <div class="container my-5">
                    <div class="alert alert-danger">
                        <h4>Error</h4>
                        <p>${message}</p>
                        <button onclick="location.reload()" 
                                class="btn btn-outline-danger btn-sm">
                            Coba Lagi
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const manager = new CategoryManager();
    manager.renderCategory();
});
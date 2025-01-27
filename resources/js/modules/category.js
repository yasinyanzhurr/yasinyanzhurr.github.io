/**
 * @file: category.js
 * @description: File untuk mengatur tampilan halaman kategori
 * @author: yyanzhur
 * @created: 2025-01-27 17:11:37
 * @last-modified: Auto-updated on save
 */


// Export fungsi initializeCategory
export function initializeCategory() {
    const manager = new CategoryManager();
    manager.renderCategory();
}

class CategoryManager {
    constructor() {
        this.categoryId = this.getCategoryFromUrl();
        this.isLoading = false;
        this.initializeAOS(); // Inisialisasi AOS jika digunakan
    }

    // Mendapatkan nama kategori dari URL dengan validasi
    getCategoryFromUrl() {
        try {
            const path = window.location.pathname.split('/');
            const category = path.find(segment => 
                ['matematika', 'bahasa', 'teknologi'].includes(segment.toLowerCase())
            );
            return category?.toLowerCase() || 'matematika';
        } catch (error) {
            console.error('Error parsing category from URL:', error);
            return 'matematika';
        }
    }

    // Inisialisasi AOS (Animate On Scroll)
    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
    }
    

    // Memuat data kategori dengan loading state
    async loadCategoryData() {
        try {
            this.setLoading(true);
            const response = await fetch(`/api/categories/${this.categoryId}.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            this.validateCategoryData(data); // Validasi data
            return data;
        } catch (error) {
            console.error('Error loading category:', error);
            this.showError('Gagal memuat data kategori');
            return null;
        } finally {
            this.setLoading(false);
        }
    }


    // Validasi data kategori
    validateCategoryData(data) {
        const requiredFields = ['title', 'description', 'background', 'subCategories', 'stats'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
    }

    // Set loading state
    setLoading(isLoading) {
        this.isLoading = isLoading;
        const loader = document.getElementById('preloader');
        if (loader) {
            loader.style.display = isLoading ? 'flex' : 'none';
        }
    }

    // Memuat artikel terbaru dengan cache
    async loadLatestArticles() {
        const cacheKey = `articles_${this.categoryId}_${new Date().toDateString()}`;
        
        // Cek cache
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        try {
            const response = await fetch(`/api/articles/${this.categoryId}/latest.json`);
            if (!response.ok) throw new Error('Artikel tidak ditemukan');
            const data = await response.json();
            
            // Simpan ke cache
            localStorage.setItem(cacheKey, JSON.stringify(data));
            return data;
        } catch (error) {
            console.error('Error loading articles:', error);
            return { articles: [] };
        }
    }

    // Render halaman kategori dengan error handling
    async renderCategory() {
        try {
            const data = await this.loadCategoryData();
            if (!data) return;

            await Promise.all([
                this.updatePageTitle(data),
                this.renderHeroSection(data),
                this.renderSubCategories(data.subCategories),
                this.renderStats(data.stats)
            ]);

            const articles = await this.loadLatestArticles();
            this.renderLatestArticles(articles.articles);

            // Refresh AOS
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        } catch (error) {
            console.error('Error rendering category:', error);
            this.showError('Terjadi kesalahan saat menampilkan konten');
        }
    }

    // Update judul halaman dengan metadata
    updatePageTitle(data) {
        document.title = `${data.title} - Platform Pembelajaran`;
        
        // Update meta tags
        const metaTags = {
            'description': data.description,
            'keywords': data.keywords?.join(', ') || '',
            'og:title': `${data.title} - Platform Pembelajaran`,
            'og:description': data.description,
            'og:image': data.background
        };

        Object.entries(metaTags).forEach(([name, content]) => {
            let meta = document.querySelector(`meta[name="${name}"]`) ||
                      document.querySelector(`meta[property="${name}"]`);
            
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(name.includes('og:') ? 'property' : 'name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });
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

// Inisialisasi dengan error handling
let categoryManager;

document.addEventListener('DOMContentLoaded', () => {
    try {
        categoryManager = new CategoryManager();
        categoryManager.renderCategory();
    } catch (error) {
        console.error('Failed to initialize CategoryManager:', error);
        // Tampilkan pesan error yang user-friendly
        const container = document.querySelector('main');
        if (container) {
            container.innerHTML = `
                <div class="container my-5">
                    <div class="alert alert-danger">
                        <h4>Error</h4>
                        <p>Maaf, terjadi kesalahan saat memuat halaman. Silakan coba lagi.</p>
                        <button onclick="location.reload()" 
                                class="btn btn-outline-danger btn-sm">
                            Refresh Halaman
                        </button>
                    </div>
                </div>
            `;
        }
    }
});

// Cleanup saat halaman unload
window.addEventListener('unload', () => {
    if (categoryManager) {
        categoryManager.cleanup();
    }
});

// Export untuk penggunaan dengan module
export { CategoryManager };
/**
 * main.js - File JavaScript utama untuk website
 * Author: Yasin
 * Last Updated: 2025-01-21
 */

// Tunggu hingga DOM sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', function () {
    initializeWebsite();
});

/**
 * Fungsi utama untuk menginisialisasi semua fitur website
 */
function initializeWebsite() {
    setupTheme();
    setupArticleFeatures();
    setupNavigation();
    setupScrollFeatures();
    setupProductFeatures();
}

/**
 * Konfigurasi Tema
 */
const ThemeConfig = {
    KEY: 'theme',
    MODES: {
        LIGHT: 'light',
        DARK: 'dark'
    },
    ICONS: {
        LIGHT: '🌙',
        DARK: '☀️'
    }
};

/**
 * Setup tema website
 */
function setupTheme() {
    // Buat atau dapatkan tombol toggle
    const themeToggle = createThemeToggle();

    // Set tema awal
    const currentTheme = localStorage.getItem(ThemeConfig.KEY) || ThemeConfig.MODES.LIGHT;
    setTheme(currentTheme);

    // Event listener untuk toggle tema
    themeToggle.addEventListener('click', toggleTheme);
}

/**
 * Buat tombol toggle tema jika belum ada
 */
function createThemeToggle() {
    if (!document.getElementById('theme-toggle')) {
        const nav = document.querySelector('.nav-menu');
        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.className = 'theme-toggle';
        toggle.innerHTML = ThemeConfig.ICONS.LIGHT;
        nav.appendChild(toggle);
    }
    return document.getElementById('theme-toggle');
}

/**
 * Set tema website
 */
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(ThemeConfig.KEY, theme);
    updateThemeIcon(theme);
}

/**
 * Update ikon tema
 */
function updateThemeIcon(theme) {
    const toggle = document.getElementById('theme-toggle');
    toggle.innerHTML = theme === ThemeConfig.MODES.DARK ?
        ThemeConfig.ICONS.DARK : ThemeConfig.ICONS.LIGHT;
}

/**
 * Toggle tema antara light dan dark
 */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === ThemeConfig.MODES.DARK ?
        ThemeConfig.MODES.LIGHT : ThemeConfig.MODES.DARK;
    setTheme(newTheme);
}

/**
 * Setup fitur-fitur artikel
 */
function setupArticleFeatures() {
    setupLikeButtons();
    setupShareButtons();
    addReadingTime();

    // Fitur khusus untuk halaman artikel penuh
    if (document.querySelector('.article-full')) {
        generateTableOfContents();
        setupReadingProgress();
    }
}

/**
 * Setup tombol like
 */
function setupLikeButtons() {
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', () => {
            const countSpan = button.querySelector('span');
            let count = parseInt(countSpan.textContent);

            if (button.classList.toggle('liked')) {
                count++;
                button.querySelector('i').className = 'fas fa-heart';
            } else {
                count--;
                button.querySelector('i').className = 'far fa-heart';
            }

            countSpan.textContent = count;
            saveLikeStatus(button.dataset.articleId, button.classList.contains('liked'));
        });
    });
}

/**
 * Setup tombol share
 */
function setupShareButtons() {
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', () => {
            const article = button.closest('article');
            const title = article.querySelector('h3').textContent;
            const url = window.location.href;

            if (navigator.share) {
                navigator.share({ title, url }).catch(console.error);
            } else {
                window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
                    '_blank'
                );
            }
        });
    });
}

/**
 * Setup fitur navigasi
 */
function setupNavigation() {
    setupMobileNav();
    setupSmoothScroll();
}

/**
 * Setup navigasi mobile
 */
function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

/**
 * Setup smooth scroll untuk link internal
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

                window.scrollTo({
                    top: targetPosition - navbarHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Setup fitur scroll
 */
function setupScrollFeatures() {
    setupScrollProgress();
}

/**
 * Setup progress bar scroll
 */
function setupScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }
}

/**
 * Setup fitur produk
 */
function setupProductFeatures() {
    setupProductPurchase();
}

/**
 * Setup pembelian produk
 */
function setupProductPurchase() {
    document.querySelectorAll('.buy-btn').forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            showPurchaseModal(productName, productPrice);
        });
    });
}

// Fungsi utilitas tambahan bisa ditambahkan di sini
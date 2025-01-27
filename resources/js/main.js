/**
 * main.js
 * File JavaScript utama untuk Blog Pembelajaran
 * 
 * @author: yyanzhur
 * @created: 2025-01-27 05:28:17
 */

// Import semua modul yang diperlukan

import { loadCategories } from './modules/category.js';
import { initializeNavigation, generateBreadcrumbs } from './modules/navigation.js';
import { initializeQuiz } from './modules/quiz.js';
import { handlePreloader, showLoadingError } from './modules/loader.js';
import { loadComponents, initializeBootstrapComponents } from './modules/components.js';
import { initTheme } from './modules/theme.js';
import { initScrollAnimations, setupProgressBar } from './modules/animations.js';
/**
 * Fungsi untuk memuat komponen HTML
 * @param {string} path - Path ke file komponen
 * @returns {Promise<string>} - Promise berisi konten HTML
 */
async function fetchComponent(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.text();
    } catch (error) {
        console.error(`Error fetching component from ${path}:`, error);
        showLoadingError(error);
        return '';
    }
}

/**
 * Fungsi untuk memuat navbar
 */
async function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        try {
            const navbarContent = await fetchComponent('/components/navbar.html');
            navbarContainer.innerHTML = navbarContent;
            
            // Setup navigasi setelah navbar dimuat
            initializeNavigation();
            setupThemeToggle();
        } catch (error) {
            console.error('Error loading navbar:', error);
            showLoadingError(error);
        }
    }
}

/**
 * Fungsi untuk memuat footer
 */
async function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        try {
            const footerContent = await fetchComponent('/components/footer.html');
            footerContainer.innerHTML = footerContent;
        } catch (error) {
            console.error('Error loading footer:', error);
            showLoadingError(error);
        }
    }
}

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Fungsi untuk menginisialisasi fitur berdasarkan halaman saat ini
 */
function initializePageFeatures() {
    const path = window.location.pathname;

    // Inisialisasi fitur quiz jika berada di halaman konten
    if (path.includes('/content/')) {
        initializeQuiz();
    }

    // Load kategori jika berada di halaman utama atau halaman kategori
    if (path === '/' || path.includes('/articles/')) {
        loadCategories();
    }
}

/**
 * Fungsi inisialisasi utama
 */
async function initializeApp() {
    try {
        // Tampilkan preloader
        handlePreloader(true);

        // Load komponen utama
        await Promise.all([
            loadNavbar(),
            loadFooter()
        ]);

        // Setup fitur-fitur
        setupAnimations();
        setupScrollAnimations();
        generateBreadcrumbs();
        initializePageFeatures();

        // Setup event listener untuk scroll yang di-debounce
        window.addEventListener('scroll', debounce(() => {
            // Handle scroll events
        }, 100));

        console.log('Application initialized successfully at:', formatDate(new Date()));
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showLoadingError(error);
    } finally {
        // Sembunyikan preloader
        handlePreloader(false);
    }
}

// Mulai aplikasi ketika DOM sudah siap
document.addEventListener('DOMContentLoaded', initializeApp);

// Export fungsi-fungsi yang mungkin dibutuhkan oleh modul lain
export {
    fetchComponent,
    initializeApp,
    setupScrollAnimations
};
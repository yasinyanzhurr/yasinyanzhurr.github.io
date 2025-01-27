/**
 * @file: main.js
 * @description: File utama yang mengimpor dan menginisialisasi semua modul
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

// Import semua modul yang diperlukan
import { initScrollAnimations } from './modules/animations.js';
import { initTheme } from './modules/theme.js';
import { handlePreloader, showLoadingError } from './modules/loader.js';
import { initializeNavigation } from './modules/navigation.js';
import { loadComponents } from './modules/components.js';
import { initializeBootstrapComponents } from './modules/bootstrap-init.js';
import { initializeCategory } from './modules/category.js';
import { initializeArticle } from './modules/article.js'; 
import { getFormattedUTCTimestamp } from './modules/utils.js';


// ====== FUNGSI INISIALISASI ======
export function initializeAll() {
    try {
        // Inisialisasi komponen dasar
        initTheme();
        initScrollAnimations();
        initializeNavigation();
        initializeBootstrapComponents();
        initializeCategory();

        // Deteksi halaman saat ini dan inisialisasi modul yang sesuai
        const currentPath = window.location.pathname;
            
        if (currentPath.includes('/articles/')) {
            if (currentPath.includes('/content/')) {
                // Jika di halaman artikel konten
                initializeArticle();
            } else {
                // Jika di halaman kategori
                initializeCategory();
            }
        }

        console.log('All modules initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        showLoadingError(error);
    }
}

// ====== EVENT LISTENERS ======
document.addEventListener('DOMContentLoaded', loadComponents);
window.addEventListener('load', handlePreloader);
window.addEventListener('error', e => showLoadingError(e.error));

// ====== PROGRESS BAR ======
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const scrolled = (window.scrollY / 
            (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
    }
});



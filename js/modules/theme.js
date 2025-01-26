/**
 * theme.js - Theme Management Module
 * 
 * @file: theme.js
 * @description: Modul untuk mengatur tema gelap/terang website
 * @author: yyanzhur
 * @created: 2025-01-26 13:25:16
 * @last-modified: 2025-01-26 13:25:16
 */

import { CONFIG } from '../main.js';

/**
 * Inisialisasi tema website
 * Memeriksa preferensi sistem dan localStorage untuk menentukan tema
 */
export function initTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
    const currentTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    applyTheme(currentTheme);
    setupThemeToggle();

    // Listener untuk perubahan preferensi sistem
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem(CONFIG.THEME_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Menerapkan tema ke website
 * @param {string} theme - Tema yang akan diterapkan ('dark' atau 'light')
 */
export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);
    console.log(`Theme applied: ${theme}`);
}

/**
 * Memperbarui ikon tema
 * @param {string} theme - Tema saat ini
 */
function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
}

/**
 * Mengatur tombol toggle tema
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}
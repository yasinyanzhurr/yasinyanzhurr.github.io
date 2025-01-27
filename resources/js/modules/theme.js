/**
 * @file: theme.js
 * @description: Modul untuk menangani tema website
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

const THEME_KEY = 'theme';

export function initTheme() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem(THEME_KEY);
    const currentTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    applyTheme(currentTheme);
    setupThemeToggle();
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    localStorage.setItem(THEME_KEY, theme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}
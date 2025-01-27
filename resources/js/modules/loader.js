/**
 * @file: loader.js
 * @description: Modul untuk menangani loading dan preloader
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

const ANIMATION_DELAY = 500;

export function handlePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, ANIMATION_DELAY);
}

export function showLoadingError(error) {
    console.error('Loading error:', error);
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.innerHTML = `
        <div class="alert alert-danger">
            <h4>Error Loading Page</h4>
            <p>Please refresh the page or try again later.</p>
            <small class="text-muted">${error.message}</small>
        </div>
    `;
}
/**
 * loader.js - Loading Management Module
 * 
 * @file: loader.js
 * @description: Modul untuk mengatur loading state dan preloader
 * @author: yyanzhur
 * @created: 2025-01-26 13:46:41
 */

import { CONFIG } from '../main.js';

let preloaderRemoved = false;

/**
 * Menangani preloader website
 */
export function handlePreloader() {
    if (preloaderRemoved) {
        console.warn('Preloader already removed');
        return;
    }

    const preloader = document.getElementById('preloader');
    if (!preloader) {
        console.warn('Preloader element not found');
        return;
    }

    try {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            preloader.remove();
            preloaderRemoved = true;
            console.log('Preloader removed successfully');
        }, CONFIG.ANIMATION_DELAY);
    } catch (error) {
        console.error('Error removing preloader:', error);
        if (preloader) {
            preloader.remove();
            preloaderRemoved = true;
        }
    }
}

/**
 * Menampilkan pesan error
 */
export function showLoadingError(error) {
    console.error('Loading error:', error);

    const preloader = document.getElementById('preloader');
    if (!preloader) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.className = 'error-container';
        document.body.prepend(errorDiv);
        errorDiv.innerHTML = createErrorMessage(error);
    } else {
        preloader.innerHTML = createErrorMessage(error);
    }
}

function createErrorMessage(error) {
    return `
        <div class="alert alert-danger">
            <h4>Error Loading Page</h4>
            <p>${error.message}</p>
            <small class="text-muted">Time: ${new Date().toLocaleString()}</small>
            <hr>
            <button onclick="location.reload()" class="btn btn-outline-danger btn-sm">
                Reload Page
            </button>
        </div>
    `;
}
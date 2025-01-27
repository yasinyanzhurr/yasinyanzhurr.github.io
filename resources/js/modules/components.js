/**
 * components.js - UI Components Management Module
 * 
 * @file: components.js
 * @description: Modul untuk mengatur komponen UI dan Bootstrap
 * @author: yyanzhur
 * @created: 2025-01-26 13:46:41
 */

import { showLoadingError } from './loader.js';

/**
 * Memuat komponen-komponen UI utama
 */
export async function loadComponents() {
    try {
        await Promise.all([
            loadComponent('navbar-container', 'navbar'),
            loadComponent('footer-container', 'footer')
        ]);

        initializeAll();
    } catch (error) {
        showLoadingError(error);
    }
}

/**
 * Memuat komponen individual
 */
async function loadComponent(containerId, componentName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const response = await fetch(`/components/${componentName}.html`);
    if (!response.ok) throw new Error(`Failed to load ${componentName}`);
    
    const html = await response.text();
    container.innerHTML = html;
}

/**
 * Inisialisasi komponen-komponen Bootstrap
 */
export function initializeBootstrapComponents() {
    try {
        // Initialize dropdowns
        const dropdowns = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdowns.map(dropdown => new bootstrap.Dropdown(dropdown));

        // Initialize tooltips
        const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltips.map(tooltip => new bootstrap.Tooltip(tooltip));
    } catch (error) {
        console.error('Error initializing Bootstrap components:', error);
    }
}
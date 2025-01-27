/**
 * @file: components.js
 * @description: Modul untuk menangani komponen website
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

import { initializeAll } from '../main.js';
import { showLoadingError } from './loader.js';

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

async function loadComponent(containerId, componentName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const response = await fetch(`/components/${componentName}.html`);
    if (!response.ok) throw new Error(`Failed to load ${componentName}`);
    
    const html = await response.text();
    container.innerHTML = html;
}
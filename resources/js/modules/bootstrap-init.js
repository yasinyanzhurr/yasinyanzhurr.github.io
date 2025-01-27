/**
 * @file: bootstrap-init.js
 * @description: Modul untuk inisialisasi komponen Bootstrap
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

export function initializeBootstrapComponents() {
    // Initialize dropdowns
    const dropdowns = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdowns.map(dropdown => new bootstrap.Dropdown(dropdown));

    // Initialize tooltips
    const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.map(tooltip => new bootstrap.Tooltip(tooltip));
}
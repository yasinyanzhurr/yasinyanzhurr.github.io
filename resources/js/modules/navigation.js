/**
 * navigation.js - Navigation Management Module
 * 
 * @file: navigation.js
 * @description: Modul untuk mengatur navigasi, breadcrumb, dan smooth scroll
 * @author: yyanzhur
 * @created: 2025-01-26 13:25:16
 * @last-modified: 2025-01-26 13:25:16
 */

/**
 * Inisialisasi semua fungsi navigasi
 */
export function initializeNavigation() {
    setupNavLinks();
    setupSmoothScroll();
    generateBreadcrumbs();
}

/**
 * Mengatur status aktif pada link navigasi
 */
function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

/**
 * Mengatur smooth scroll untuk anchor links
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href !== '#') {
                document.querySelector(href)?.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Menghasilkan breadcrumb berdasarkan path URL
 */
function generateBreadcrumbs() {
    const container = document.querySelector('.breadcrumb-container');
    if (!container) return;

    const path = window.location.pathname;
    const cleanPath = path.replace(/^\/|\/$/g, '')
                         .replace('articles/', '')
                         .replace(/\/+/g, '/');
    const pathArray = cleanPath.split('/');
    
    const breadcrumbHtml = `
        <ol class="breadcrumb">
            <li class="breadcrumb-item">
                <a href="/"><i class="bi bi-house"></i> Beranda</a>
            </li>
            ${generateBreadcrumbItems(pathArray)}
        </ol>
    `;
    
    container.innerHTML = breadcrumbHtml;
}

/**
 * Menghasilkan item-item breadcrumb
 * @param {string[]} pathArray - Array path URL yang sudah dibersihkan
 * @returns {string} HTML string untuk item-item breadcrumb
 */
function generateBreadcrumbItems(pathArray) {
    let currentPath = '';
    return pathArray
        .filter(item => item && item !== 'articles')
        .map((item, index, arr) => {
            currentPath += `/articles/${item}`;
            const isLast = index === arr.length - 1;
            const title = getPageTitle(item);
            
            return isLast
                ? `<li class="breadcrumb-item active">${title}</li>`
                : `<li class="breadcrumb-item"><a href="${currentPath}">${title}</a></li>`;
        })
        .join('');
}

/**
 * Mendapatkan judul halaman dari slug URL
 * @param {string} slug - Slug URL
 * @returns {string} Judul halaman yang sesuai
 */
function getPageTitle(slug) {
    const titles = {
        'matematika': 'Matematika',
        'bahasa': 'Bahasa',
        'teknologi': 'Teknologi',
        'sd': 'SD',
        'smp': 'SMP',
        'sma': 'SMA',
        'inggris': 'Bahasa Inggris',
        'arab': 'Bahasa Arab',
        'frontend': 'Frontend',
        'backend': 'Backend',
        'office': 'Microsoft Office'
    };
    return titles[slug] || slug;
}
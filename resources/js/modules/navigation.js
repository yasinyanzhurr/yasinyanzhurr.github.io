/**
 * @file: navigation.js
 * @description: Modul untuk menangani navigasi dan breadcrumbs
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

export function initializeNavigation() {
    setupNavLinks();
    setupSmoothScroll();
    generateBreadcrumbs();
}


function setupNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

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

// ====== FUNGSI BREADCRUMB ======
function generateBreadcrumbs() {
    const container = document.querySelector('.breadcrumb-container');
    if (!container) return;

    const path = window.location.pathname;
    // Hapus 'articles/' dari path dan bersihkan multiple slashes
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

function generateBreadcrumbItems(pathArray) {
    let currentPath = '';
    return pathArray
        .filter(item => item && item !== 'articles') // Filter out 'articles' and empty items
        .map((item, index, arr) => {
            // Tambahkan 'articles' ke path untuk mempertahankan struktur URL yang benar
            currentPath += `/articles/${item}`;
            const isLast = index === arr.length - 1;
            const title = getPageTitle(item);
            
            return isLast
                ? `<li class="breadcrumb-item active">${title}</li>`
                : `<li class="breadcrumb-item"><a href="${currentPath}">${title}</a></li>`;
        })
        .join('');
}

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
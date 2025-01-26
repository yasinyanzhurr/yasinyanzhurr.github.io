/**
 * @file: nama-file.js
 * @description: Deskripsi singkat tentang file
 * @author: yyanzhur
 * @created: 2025-01-26 12:51:13
 * @last-modified: ${getFormattedUTCTimestamp()}
 */


/**
 * main.js
 * File ini berisi fungsi-fungsi utama untuk website pembelajaran
 * Dibuat oleh: yyanzhur
 * Terakhir diupdate: 2025-01-26
 */

/**
 * main.js
 * Script utama untuk Platform Pembelajaran
 * Author: yyanzhur
 * Last updated: 2025-01-26 12:40:47
 */

// ====== VARIABEL GLOBAL DAN KONSTANTA ======
const THEME_KEY = 'theme';
const ANIMATION_DELAY = 500;

// ====== FUNGSI LOADING DAN PRELOADER ======
function handlePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, ANIMATION_DELAY);
}

function showLoadingError(error) {
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

// ====== FUNGSI TEMA ======
function initTheme() {
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

// ====== FUNGSI KOMPONEN ======
async function loadComponents() {
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

// ====== FUNGSI ANIMASI ======
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}

// ====== FUNGSI NAVIGASI ======
function initializeNavigation() {
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


// ====== FUNGSI BOOTSTRAP ======
function initializeBootstrapComponents() {
    // Initialize dropdowns
    const dropdowns = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdowns.map(dropdown => new bootstrap.Dropdown(dropdown));

    // Initialize tooltips
    const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.map(tooltip => new bootstrap.Tooltip(tooltip));
}

// ====== FUNGSI INISIALISASI ======
function initializeAll() {
    initTheme();
    initScrollAnimations();
    initializeNavigation();
    initializeBootstrapComponents();
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


/**
 * Utility functions untuk timestamp dan user info
 * Author: yyanzhur
 * Created: 2025-01-26 12:51:13
 */

// Fungsi untuk mendapatkan timestamp dalam format UTC
function getFormattedUTCTimestamp() {
    const now = new Date();
    return now.toISOString()
              .replace('T', ' ')
              .replace(/\.\d+Z$/, '');
}

// Fungsi untuk memformat timestamp untuk display
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

// Fungsi untuk menambahkan timestamp ke elemen
function addTimestampToElement(elementId, timestamp) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('title', `Last updated: ${timestamp}`);
        element.setAttribute('data-bs-toggle', 'tooltip');
    }
}

// Fungsi untuk menambahkan info author
function addAuthorInfo(elementId, author) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('title', `Created by: ${author}`);
        element.setAttribute('data-bs-toggle', 'tooltip');
    }
}

// Contoh penggunaan:
// addTimestampToElement('last-updated', getFormattedUTCTimestamp());
// addAuthorInfo('author-info', 'yyanzhur');
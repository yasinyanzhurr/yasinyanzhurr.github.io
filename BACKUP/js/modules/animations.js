/**
 * animations.js - Animations Management Module
 * 
 * @file: animations.js
 * @description: Modul untuk mengatur animasi dan efek scroll
 * @author: yyanzhur
 * @created: 2025-01-26 13:25:16
 * @last-modified: 2025-01-26 13:25:16
 */

/**
 * Inisialisasi animasi scroll
 */
export function initScrollAnimations() {
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

/**
 * Setup progress bar untuk scroll
 */
export function setupProgressBar() {
    window.addEventListener('scroll', () => {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const scrolled = (window.scrollY / 
                (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${scrolled}%`;
        }
    });
}
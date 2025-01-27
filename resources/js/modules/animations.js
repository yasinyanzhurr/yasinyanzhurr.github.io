/**
 * @file: animation.js
 * @description: Modul untuk menangani animasi
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
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
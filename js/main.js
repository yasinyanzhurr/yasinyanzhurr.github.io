// Utility functions
const utils = {
    currentTime: '2025-01-20 16:08:08',
    currentUser: 'yasinyanzhurr',

    // Debounce function untuk optimisasi performa
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Lazy loading images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

class NavbarHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupDropdown();
        this.setupMobileMenu();
    }

    setupDropdown() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');

            // For mobile devices
            toggle.addEventListener('click', (e) => {
                e.preventDefault();

                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown && d.classList.contains('active')) {
                        d.classList.remove('active');
                    }
                });

                dropdown.classList.toggle('active');
            });

            // For desktop hover
            if (window.innerWidth > 768) {
                dropdown.addEventListener('mouseenter', () => {
                    dropdown.classList.add('active');
                });

                dropdown.addEventListener('mouseleave', () => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.querySelector('i').classList.toggle('fa-bars');
            navToggle.querySelector('i').classList.toggle('fa-times');
        });
    }
}

// Initialize navbar handler
document.addEventListener('DOMContentLoaded', () => {
    new NavbarHandler();
});

// Main App Class
class PortfolioApp {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        this.isLoading = true;
        this.init();
    }

    init() {
        this.setupLoader();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.initializeBlogFilters();
        this.initializeDarkMode();
        utils.lazyLoadImages();
    }

    setupLoader() {
        const loader = document.createElement('div');
        loader.classList.add('loading');
        loader.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loader);

        window.addEventListener('load', () => {
            this.isLoading = false;
            loader.remove();
        });
    }

    setupEventListeners() {
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Optimized scroll handler
        window.addEventListener('scroll', utils.debounce(() => {
            this.handleScroll();
        }, 10));

        // Mobile menu
        this.setupMobileMenu();

        // Form handling
        this.setupContactForm();
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            this.navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > this.lastScroll && !this.navbar.classList.contains('scroll-down')) {
            this.navbar.classList.remove('scroll-up');
            this.navbar.classList.add('scroll-down');
        } else if (currentScroll < this.lastScroll && this.navbar.classList.contains('scroll-down')) {
            this.navbar.classList.remove('scroll-down');
            this.navbar.classList.add('scroll-up');
        }
        this.lastScroll = currentScroll;
    }

    setupMobileMenu() {
        const mobileMenuButton = document.createElement('div');
        mobileMenuButton.classList.add('mobile-menu');
        mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';

        const navContainer = document.querySelector('.navbar .container');
        const navLinks = document.querySelector('.nav-links');

        navContainer.insertBefore(mobileMenuButton, navLinks);

        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuButton.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulasi pengiriman form (ganti dengan API call sebenarnya)
            await new Promise(resolve => setTimeout(resolve, 1500));

            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
        } catch (error) {
            alert('Error sending message. Please try again.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.project-card, .blog-card, .skill-item')
            .forEach(el => observer.observe(el));
    }

    initializeBlogFilters() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const blogCards = document.querySelectorAll('.blog-card');

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;

                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                blogCards.forEach(card => {
                    card.style.display =
                        (category === 'all' || card.dataset.category === category)
                            ? 'block'
                            : 'none';
                });
            });
        });
    }

    initializeDarkMode() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.classList.add('dark-mode-toggle');
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            darkModeToggle.innerHTML = isDark ?
                '<i class="fas fa-sun"></i>' :
                '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        document.querySelector('.navbar .container').appendChild(darkModeToggle);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Update copyright year
document.querySelector('footer p').innerHTML =
    `&copy; ${new Date().getFullYear()} Yasin's Portfolio. All rights reserved.`;
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Loading animation
    const loader = document.createElement('div');
    loader.classList.add('loading');
    loader.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loader);

    // Remove loader after page loads
    window.addEventListener('load', function () {
        loader.remove();
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileMenuButton = document.createElement('div');
    mobileMenuButton.classList.add('mobile-menu');
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';

    const navContainer = document.querySelector('.navbar .container');
    const navLinks = document.querySelector('.nav-links');

    navContainer.insertBefore(mobileMenuButton, navLinks);

    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuButton.querySelector('i').classList.toggle('fa-bars');
        mobileMenuButton.querySelector('i').classList.toggle('fa-times');
    });

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Add loading state to submit button
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                alert('Thank you for your message! I will get back to you soon.');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                contactForm.reset();
            }, 1500);
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .blog-card, .skill-item').forEach(el => {
        observer.observe(el);
    });
});

// Dynamic copyright year
document.querySelector('footer p').innerHTML =
    `&copy; ${new Date().getFullYear()} Yasin's Portfolio. All rights reserved.`;

// Tambahkan di js/main.js

// Dark Mode Implementation
function initDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.classList.add('dark-mode-toggle');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.querySelector('.navbar .container').appendChild(darkModeToggle);

    // Check user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Initialize dark mode
initDarkMode();
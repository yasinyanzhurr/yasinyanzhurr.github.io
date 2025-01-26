// Function to load HTML components
async function loadComponents() {
    try {
        // Load Navbar
        const navbarResponse = await fetch('/components/navbar.html');
        if (!navbarResponse.ok) throw new Error('Error loading navbar');
        const navbarHtml = await navbarResponse.text();
        document.getElementById('navbar-container').innerHTML = navbarHtml;

        // Load Footer
        const footerResponse = await fetch('/components/footer.html');
        if (!footerResponse.ok) throw new Error('Error loading footer');
        const footerHtml = await footerResponse.text();
        document.getElementById('footer-container').innerHTML = footerHtml;

        // Initialize Bootstrap components
        initializeBootstrapComponents();
        
        // Initialize theme
        initThemeToggle();
        
        // Initialize other features
        initScrollAnimation();
    } catch (error) {
        console.error('Error loading components:', error);
        showErrorMessage();
    }
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
    // Initialize dropdowns
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });
}

// Show error message if components fail to load
function showErrorMessage() {
    const errorHtml = `
        <div class="alert alert-danger m-3" role="alert">
            <h4 class="alert-heading">Error Loading Components</h4>
            <p>Sorry, we couldn't load some parts of the page. Please try refreshing.</p>
        </div>
    `;
    
    document.getElementById('navbar-container').innerHTML = errorHtml;
    document.getElementById('footer-container').innerHTML = errorHtml;
}

// Initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
}

// Initialize scroll animations
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
}

// Load all components when DOM is ready
document.addEventListener('DOMContentLoaded', loadComponents);

// Add scroll event listener for progress bar
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    }
});
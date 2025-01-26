/**
 * main.js
 * File ini berisi fungsi-fungsi utama untuk website pembelajaran
 * Dibuat oleh: yyanzhur
 * Terakhir diupdate: 2025-01-26
 */

// ====== FUNGSI UNTUK MEMUAT KOMPONEN HALAMAN ======

/**
 * Fungsi untuk memuat navbar dan footer
 * Menggunakan async/await untuk mengambil file HTML dari server
 */
async function loadComponents() {
    try {
        // 1. Memuat Navbar (bagian atas website)
        const navbarResponse = await fetch('/components/navbar.html');
        // Periksa apakah pengambilan navbar berhasil
        if (!navbarResponse.ok) throw new Error('Gagal memuat navbar');
        // Ubah response menjadi text HTML
        const navbarHtml = await navbarResponse.text();
        // Masukkan navbar ke dalam container
        document.getElementById('navbar-container').innerHTML = navbarHtml;

        // 2. Memuat Footer (bagian bawah website)
        const footerResponse = await fetch('/components/footer.html');
        // Periksa apakah pengambilan footer berhasil
        if (!footerResponse.ok) throw new Error('Gagal memuat footer');
        // Ubah response menjadi text HTML
        const footerHtml = await footerResponse.text();
        // Masukkan footer ke dalam container
        document.getElementById('footer-container').innerHTML = footerHtml;

        // 3. Menjalankan fungsi-fungsi inisialisasi
        initializeBootstrapComponents(); // Mengaktifkan komponen Bootstrap
        initThemeToggle();              // Mengaktifkan tombol tema gelap/terang
        initScrollAnimation();          // Mengaktifkan animasi scroll
        initializeNavigation();         // Mengaktifkan navigasi
        
    } catch (error) {
        // Jika terjadi error, tampilkan pesan error
        console.error('Terjadi kesalahan saat memuat komponen:', error);
        showErrorMessage();
    }
}

// ====== FUNGSI UNTUK NAVIGASI ======

/**
 * Fungsi untuk mengatur tombol navigasi dan link
 * Termasuk tombol "Mulai Belajar" dan menu navigasi
 */
function initializeNavigation() {
    // 1. Mengatur tombol "Mulai Belajar"
    const startLearningBtn = document.querySelector('.start-learning-btn');
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Mencegah perilaku default link
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href; // Pindah ke halaman tujuan
            }
        });
    }

    // 2. Mengatur link-link navigasi
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        // Tandai halaman aktif
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }

        // Tambahkan event click
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                window.location.href = href;
            }
        });
    });
}

// ====== FUNGSI UNTUK KOMPONEN BOOTSTRAP ======

/**
 * Fungsi untuk menginisialisasi komponen-komponen Bootstrap
 * Seperti dropdown menu dan tooltip
 */
function initializeBootstrapComponents() {
    // 1. Inisialisasi dropdown
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => {
        return new bootstrap.Dropdown(dropdownToggleEl);
    });

    // 2. Inisialisasi tooltip
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// ====== FUNGSI UNTUK PESAN ERROR ======

/**
 * Fungsi untuk menampilkan pesan error
 * Dipanggil ketika terjadi kesalahan memuat komponen
 */
function showErrorMessage() {
    const errorHtml = `
        <div class="alert alert-danger m-3" role="alert">
            <h4 class="alert-heading">Terjadi Kesalahan</h4>
            <p>Maaf, kami tidak dapat memuat beberapa bagian halaman. 
               Silakan coba muat ulang halaman.</p>
        </div>
    `;
    
    // Tampilkan pesan error di navbar dan footer
    document.getElementById('navbar-container').innerHTML = errorHtml;
    document.getElementById('footer-container').innerHTML = errorHtml;
}

// ====== FUNGSI UNTUK TEMA GELAP/TERANG ======

/**
 * Fungsi untuk mengatur tema gelap/terang
 * Menyimpan preferensi tema di localStorage
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Cek preferensi sistem (gelap/terang)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Ambil tema dari localStorage atau gunakan preferensi sistem
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Terapkan tema
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Tambahkan event click untuk toggle tema
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

/**
 * Fungsi untuk mengubah ikon tema
 * @param {string} theme - Tema yang aktif ('dark' atau 'light')
 */
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
}

// ====== FUNGSI UNTUK ANIMASI ======

/**
 * Fungsi untuk menginisialisasi animasi scroll
 * Menggunakan Intersection Observer untuk mengamati elemen
 */
function initScrollAnimation() {
    // Buat observer untuk mengamati elemen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Tambahkan kelas animasi ketika elemen terlihat
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });

    // Amati semua elemen dengan kelas 'animate-on-scroll'
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
}

// ====== EVENT LISTENERS ======

// Jalankan loadComponents saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadComponents);

// Jalankan progress bar saat scroll
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        // Hitung persentase scroll
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        // Update lebar progress bar
        progressBar.style.width = `${scrolled}%`;
    }
});

// <!-- JavaScript untuk preloader -->

    window.addEventListener('load', function() {
        document.getElementById('preloader').style.display = 'none';
    });


// Menghilangkan preloader saat halaman selesai dimuat
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Mengaktifkan animasi scroll
document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
});

// Menangani error jika terjadi masalah loading
window.addEventListener('error', function(e) {
    console.error('Loading error:', e.error);
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.innerHTML = `
            <div class="alert alert-danger">
                <h4>Error Loading Page</h4>
                <p>Please refresh the page or try again later.</p>
            </div>
        `;
    }
});

// Menambahkan smooth scroll untuk link internal
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href !== '#') {
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
/**
 * main.js
 * Entry point untuk Platform Pembelajaran
 * 
 * @file: main.js
 * @description: File utama yang menginisialisasi semua modul dan fungsi website
 * @author: yyanzhur
 * @created: 2025-01-26 18:46:36
 * @last-modified: 2025-01-26 18:46:36
 */

// Import statements di awal file
import { Category } from './modules/category.js';  // atau import Category from './modules/category.js';
import { QuizManager } from './modules/quiz.js';
import { handlePreloader, showLoadingError } from './modules/loader.js';
import { loadComponents, initializeBootstrapComponents } from './modules/components.js';
import { initTheme } from './modules/theme.js';
import { initScrollAnimations, setupProgressBar } from './modules/animations.js';
import { initializeNavigation } from './modules/navigation.js';

// Konstanta Global
export const CONFIG = {
    THEME_KEY: 'theme',
    ANIMATION_DELAY: 500,
    AUTHOR: 'yyanzhur',
    VERSION: '1.0.0'
};

// State tracking
let componentsLoaded = false;
let initializationComplete = false;

/**
 * Initialize Quiz
 */
function initializeQuiz() {
    try {
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            window.quiz = new QuizManager('perkalian-dasar-1');
            window.quiz.init();
        }
    } catch (error) {
        console.error('Error initializing quiz:', error);
        showLoadingError(error);
    }
}

/**
 * Setup error boundary
 */
function setupErrorBoundary() {
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Global error:', {
            message: msg,
            url: url,
            lineNo: lineNo,
            columnNo: columnNo,
            error: error
        });
        
        if (document.getElementById('quiz-container')) {
            document.getElementById('quiz-container').innerHTML = `
                <div class="alert alert-danger">
                    <h4>Oops! Terjadi Kesalahan</h4>
                    <p>Mohon maaf, terjadi kesalahan teknis. Silakan muat ulang halaman.</p>
                    <button onclick="location.reload()" class="btn btn-outline-danger btn-sm">
                        Muat Ulang
                    </button>
                </div>
            `;
        }
        
        return false;
    };
}

/**
 * Initialize all components
 */
function initializeAll() {
    try {
        initTheme();
        initScrollAnimations();
        initializeNavigation();
        initializeBootstrapComponents();
        setupProgressBar();
        initializeQuiz(); // Menambahkan inisialisasi quiz
        
        initializationComplete = true;
        console.log('All components initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        showLoadingError(error);
    }
}

/**
 * Handle DOMContentLoaded event
 */
async function handleDOMContentLoaded() {
    console.log('DOM Content Loaded - Starting initialization...');
    try {
        await loadComponents();
        componentsLoaded = true;
        initializeAll();
    } catch (error) {
        console.error('Error during initialization:', error);
        showLoadingError(error);
    }
}

/**
 * Handle Window load event
 */
function handleWindowLoad() {
    console.log('Window Loaded - Handling preloader...');
    handlePreloader();
}

/**
 * Handle global errors
 */
function handleGlobalError(event) {
    console.error('Global error:', event.error);
    showLoadingError(event.error);
}

/**
 * Fungsi utama untuk inisialisasi aplikasi
 */
function initializeApp() {
    setupErrorBoundary();
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    window.addEventListener('load', handleWindowLoad);
    window.addEventListener('error', handleGlobalError);
}

// Start the application
initializeApp();
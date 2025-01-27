/**
 * main.js
 * Entry point untuk Platform Pembelajaran
 * 
 * @file: main.js
 * @author: yyanzhur
 * @created: 2025-01-27 03:37:00
 * @last-modified: 2025-01-27 03:37:00
 */

import { QuizManager } from './modules/quiz.js';
import { handlePreloader, showLoadingError } from './modules/loader.js';
import { loadComponents, initializeBootstrapComponents } from './modules/components.js';
import { initTheme } from './modules/theme.js';
import { initScrollAnimations, setupProgressBar } from './modules/animations.js';
import { initializeNavigation } from './modules/navigation.js';

export const CONFIG = Object.freeze({
    THEME_KEY: 'theme',
    ANIMATION_DELAY: 500,
    AUTHOR: 'yyanzhur',
    VERSION: '1.0.0',
    DEBUG: true
});

// State tracking
let componentsLoaded = false;
let initializationComplete = false;

/**
 * Initialize Quiz
 */
async function initializeQuiz() {
    try {
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            const quiz = new QuizManager('perkalian-dasar-1');
            await quiz.init();
            window.quiz = quiz;
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
        
        const quizContainer = document.getElementById('quiz-container');
        if (quizContainer) {
            quizContainer.innerHTML = `
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
async function initializeAll() {
    try {
        initTheme();
        initScrollAnimations();
        initializeNavigation();
        initializeBootstrapComponents();
        setupProgressBar();
        await initializeQuiz();
        
        initializationComplete = true;
        CONFIG.DEBUG && console.log('All components initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        showLoadingError(error);
    }
}

/**
 * Handle DOMContentLoaded event
 */
async function handleDOMContentLoaded() {
    CONFIG.DEBUG && console.log('DOM Content Loaded - Starting initialization...');
    try {
        await loadComponents();
        componentsLoaded = true;
        await initializeAll();
    } catch (error) {
        console.error('Error during initialization:', error);
        showLoadingError(error);
    }
}

/**
 * Handle Window load event
 */
function handleWindowLoad() {
    CONFIG.DEBUG && console.log('Window Loaded - Handling preloader...');
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
 * Initialize application
 */
function initializeApp() {
    setupErrorBoundary();
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    window.addEventListener('load', handleWindowLoad);
    window.addEventListener('error', handleGlobalError);
}

// Start the application
initializeApp();
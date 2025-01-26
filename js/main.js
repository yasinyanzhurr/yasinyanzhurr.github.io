/**
 * main.js
 * Entry point untuk Platform Pembelajaran
 * 
 * @file: main.js
 * @description: File utama yang menginisialisasi semua modul dan fungsi website
 * @author: yyanzhur
 * @created: 2025-01-26 13:46:41
 * @last-modified: 2025-01-26 13:46:41
 */

// Import semua fungsi yang dibutuhkan
import { 
    handlePreloader, 
    showLoadingError 
} from './modules/loader.js';

import { 
    loadComponents, 
    initializeBootstrapComponents 
} from './modules/components.js';

import { 
    initTheme 
} from './modules/theme.js';

import { 
    initScrollAnimations, 
    setupProgressBar 
} from './modules/animations.js';

import { 
    initializeNavigation 
} from './modules/navigation.js';

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
 * Initialize all components
 */
export function initializeAll() {
    try {
        initTheme();
        initScrollAnimations();
        initializeNavigation();
        initializeBootstrapComponents();
        setupProgressBar();
        
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
    document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    window.addEventListener('load', handleWindowLoad);
    window.addEventListener('error', handleGlobalError);
}

// Start the application
initializeApp();
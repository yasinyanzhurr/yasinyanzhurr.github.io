/**
 * main.js
 * Entry point untuk Platform Pembelajaran
 * 
 * @author: yyanzhur
 * @created: 2025-01-26 13:05:14
 * @last-modified: ${getFormattedUTCTimestamp()}
 */

import { initTheme, applyTheme } from './modules/theme.js';
import { handlePreloader, showLoadingError } from './modules/loader.js';
import { loadComponents, initializeBootstrapComponents } from './modules/components.js';
import { initScrollAnimations, setupProgressBar } from './modules/animations.js';
import { initializeNavigation } from './modules/navigation.js';
import { formatTimestamp, addTimestampToElement } from './modules/utils.js';

// Constants
export const CONFIG = {
    THEME_KEY: 'theme',
    ANIMATION_DELAY: 500,
    AUTHOR: 'yyanzhur'
};

// Initialize all modules
function initializeAll() {
    initTheme();
    initScrollAnimations();
    initializeNavigation();
    initializeBootstrapComponents();
    setupProgressBar();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', loadComponents);
window.addEventListener('load', handlePreloader);
window.addEventListener('error', e => showLoadingError(e.error));

export { initializeAll };
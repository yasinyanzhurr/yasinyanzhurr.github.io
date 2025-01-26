/**
 * utils.js - Utility Functions Module
 * 
 * @file: utils.js
 * @description: Modul untuk fungsi-fungsi utilitas
 * @author: yyanzhur
 * @created: 2025-01-26 13:25:16
 * @last-modified: 2025-01-26 13:25:16
 */

/**
 * Mendapatkan timestamp dalam format UTC
 * @returns {string} Timestamp dalam format YYYY-MM-DD HH:MM:SS
 */
export function getFormattedUTCTimestamp() {
    const now = new Date();
    return now.toISOString()
              .replace('T', ' ')
              .replace(/\.\d+Z$/, '');
}

/**
 * Memformat timestamp untuk display
 * @param {string} timestamp - Timestamp yang akan diformat
 * @returns {string} Timestamp yang sudah diformat
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}

/**
 * Menambahkan timestamp ke elemen
 * @param {string} elementId - ID elemen yang akan ditambahkan timestamp
 * @param {string} timestamp - Timestamp yang akan ditambahkan
 */
export function addTimestampToElement(elementId, timestamp) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('title', `Last updated: ${timestamp}`);
        element.setAttribute('data-bs-toggle', 'tooltip');
    }
}

/**
 * Menambahkan info author ke elemen
 * @param {string} elementId - ID elemen yang akan ditambahkan info author
 * @param {string} author - Nama author
 */
export function addAuthorInfo(elementId, author) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('title', `Created by: ${author}`);
        element.setAttribute('data-bs-toggle', 'tooltip');
    }
}
/**
 * @file: utils.js
 * @description: Modul untuk fungsi-fungsi utilitas
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

// Fungsi untuk mendapatkan timestamp dalam format UTC
export function getFormattedUTCTimestamp() {
    const now = new Date();
    return now.toISOString()
              .replace('T', ' ')
              .replace(/\.\d+Z$/, '');
}


// Fungsi untuk memformat timestamp untuk display
function formatTimestamp(timestamp) {
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

// Fungsi untuk menambahkan timestamp ke elemen
function addTimestampToElement(elementId, timestamp) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('title', `Last updated: ${timestamp}`);
        element.setAttribute('data-bs-toggle', 'tooltip');
    }
}

// Fungsi untuk menambahkan info author
function addAuthorInfo(elementId, author) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute('title', `Created by: ${author}`);
        element.setAttribute('data-bs-toggle', 'tooltip');
    }
}

// Contoh penggunaan:
// addTimestampToElement('last-updated', getFormattedUTCTimestamp());
// addAuthorInfo('author-info', 'yyanzhur');
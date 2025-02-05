/**
 * @file: animation.js
 * @description: Modul untuk menangani animasi
 * @author: yyanzhur
 * @created: 2025-01-27 16:32:14
 */

export function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
}


// animations.js - Bagian Tabel Perkalian
function createMultiplicationTable(maxNumber = 10) {
    const tableContainer = document.querySelector('#tabel .table-responsive');
    
    let tableHTML = `
        <table class="table table-bordered multiplication-table">
            <thead class="table-header">
                <tr>
                    <th>×</th>
    `;
    
    // Buat header kolom
    for (let i = 1; i <= maxNumber; i++) {
        tableHTML += `<th>${i}</th>`;
    }
    tableHTML += '</tr></thead><tbody>';
    
    // Buat baris dan kolom perkalian
    for (let row = 1; row <= maxNumber; row++) {
        tableHTML += `
            <tr>
                <th class="table-header">${row}</th>
        `;
        
        // Isi sel perkalian dengan class khusus untuk kelipatan
        for (let col = 1; col <= maxNumber; col++) {
            const result = row * col;
            let specialClass = '';
            if (result % 2 === 0) specialClass += ' multiple-of-2';
            if (result % 3 === 0) specialClass += ' multiple-of-3';
            if (result % 5 === 0) specialClass += ' multiple-of-5';
            tableHTML += `<td class="table-cell${specialClass}">${result}</td>`;
        }
        
        tableHTML += '</tr>';
    }
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
}

// Panggil fungsi saat dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    createMultiplicationTable(10);

    // Observer untuk animasi
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe section tabel
    const tabelSection = document.querySelector('#tabel');
    if (tabelSection) {
        observer.observe(tabelSection);
    }
});

class PDFExporter {
    constructor() {
        this.initializePDFExport();
    }

    async initializePDFExport() {
        try {
            await this.loadPDFLibrary();
            this.addExportButtons();
        } catch (error) {
            console.warn('PDF export initialization non-critical error:', error);
        }
    }

    async loadPDFLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    addExportButtons() {
        const articles = document.querySelectorAll('.blog-post');
        articles.forEach(article => {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-secondary export-pdf';
            exportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Export as PDF';
            exportBtn.onclick = () => this.exportToPDF(article);
            article.querySelector('.post-header').appendChild(exportBtn);
        });
    }

    async exportToPDF(element) {
        try {
            const filename = document.title + '.pdf';
            const options = {
                margin: 1,
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            await html2pdf().set(options).from(element).save();
        } catch (error) {
            console.warn('PDF export non-critical error:', error);
            alert('Could not export PDF. Please try again.');
        }
    }
}

// Initialize PDF exporter
const pdfExporter = new PDFExporter();
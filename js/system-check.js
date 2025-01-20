class SystemCheck {
    constructor() {
        this.currentUser = 'yasinyanzhurr';
        this.lastCheck = '2025-01-20 15:55:45';
        this.status = {
            database: false,
            assets: false,
            api: false
        };
    }

    async performInitialCheck() {
        console.log('Memulai pengecekan sistem...');

        try {
            // Cek koneksi dasar
            await this.checkConnection();

            // Cek assets
            await this.checkAssets();

            // Cek API
            await this.checkAPI();

            console.log('Sistem berjalan normal');
            return true;
        } catch (error) {
            console.warn('Peringatan sistem:', error);
            return false;
        }
    }

    async checkConnection() {
        try {
            const response = await fetch('/api/health');
            if (!response.ok) throw new Error('Koneksi bermasalah');
            this.status.database = true;
        } catch (error) {
            throw new Error('Gagal terhubung ke server');
        }
    }

    async checkAssets() {
        try {
            const assets = [
                '/css/style.css',
                '/css/blog-post.css',
                '/js/main.js'
            ];

            for (const asset of assets) {
                const response = await fetch(asset);
                if (!response.ok) throw new Error(`Asset ${asset} tidak ditemukan`);
            }
            this.status.assets = true;
        } catch (error) {
            throw new Error('Beberapa asset tidak dapat dimuat');
        }
    }

    async checkAPI() {
        try {
            const response = await fetch('/api/posts');
            if (!response.ok) throw new Error('API tidak merespons');
            this.status.api = true;
        } catch (error) {
            throw new Error('API tidak dapat diakses');
        }
    }
}

// Inisialisasi pengecekan sistem
const systemCheck = new SystemCheck();
systemCheck.performInitialCheck();
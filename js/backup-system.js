class BackupSystem {
    constructor() {
        this.backupInterval = 3600000; // 1 hour
        this.maxBackups = 24; // Keep 24 hours of backups
        this.initializeBackup();
    }

    async initializeBackup() {
        try {
            await this.checkBackupStorage();
            this.startAutomaticBackup();
        } catch (error) {
            console.warn('Backup system warning:', error);
        }
    }

    async checkBackupStorage() {
        const backups = await this.getExistingBackups();
        if (backups.length > this.maxBackups) {
            await this.cleanOldBackups(backups);
        }
    }

    async startAutomaticBackup() {
        setInterval(async () => {
            await this.createBackup();
        }, this.backupInterval);
    }

    async createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            content: await this.gatherContent(),
            settings: await this.gatherSettings()
        };

        try {
            await this.saveBackup(backup);
            console.log('Backup created successfully');
        } catch (error) {
            console.warn('Backup creation warning:', error);
        }
    }

    async gatherContent() {
        // Gather all blog content
        const posts = await this.getAllPosts();
        const comments = await this.getAllComments();
        const subscribers = await this.getAllSubscribers();

        return { posts, comments, subscribers };
    }

    async saveBackup(backup) {
        try {
            const response = await fetch('/api/backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(backup)
            });

            if (!response.ok) throw new Error('Backup save failed');
        } catch (error) {
            console.warn('Backup save warning:', error);
        }
    }
}

// Initialize backup system
const backupSystem = new BackupSystem();
class BlogSystem {
    constructor() {
        this.currentUser = 'yasinyanzhurr';
        this.lastUpdate = '2025-01-20 15:35:15';
        this.components = {};
        this.initializeSystem();
    }

    async initializeSystem() {
        try {
            // Initialize core components
            await this.initializeComponents();
            // Setup security
            await this.setupSecurity();
            // Start backup system
            this.initializeBackup();
            // Setup user session
            this.setupUserSession();
        } catch (error) {
            console.warn('System initialization warning:', error);
        }
    }

    async initializeComponents() {
        // Initialize all components with error handling
        this.components = {
            analytics: new BlogAnalytics(),
            notifications: new NotificationSystem(),
            pdfExport: new PDFExporter(),
            errorHandler: new ErrorHandler(),
            search: new BlogSearch(),
            tags: new TagSystem()
        };
    }

    setupUserSession() {
        const session = {
            user: this.currentUser,
            lastActive: this.lastUpdate,
            permissions: this.getUserPermissions()
        };

        localStorage.setItem('blogSession', JSON.stringify(session));
    }

    getUserPermissions() {
        return {
            canEdit: true,
            canDelete: true,
            canPublish: true,
            isAdmin: true
        };
    }
}

// Initialize the blog system
const blogSystem = new BlogSystem();
class SecuritySystem {
    constructor() {
        this.sessionTimeout = 3600000; // 1 hour
        this.initializeSecurity();
    }

    async initializeSecurity() {
        try {
            await this.setupCSRFProtection();
            this.startSessionMonitor();
            this.setupXSSProtection();
        } catch (error) {
            console.warn('Security system warning:', error);
        }
    }

    setupCSRFProtection() {
        const token = this.generateCSRFToken();
        document.querySelectorAll('form').forEach(form => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_csrf';
            input.value = token;
            form.appendChild(input);
        });
    }

    startSessionMonitor() {
        setInterval(() => {
            this.checkSession();
        }, 60000); // Check every minute
    }

    setupXSSProtection() {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = this.sanitizeInput(e.target.value);
            });
        });
    }

    sanitizeInput(input) {
        return input.replace(/[<>]/g, '');
    }

    checkSession() {
        const session = JSON.parse(localStorage.getItem('blogSession'));
        if (!session || this.isSessionExpired(session)) {
            this.logout();
        }
    }

    isSessionExpired(session) {
        const lastActive = new Date(session.lastActive);
        return (Date.now() - lastActive) > this.sessionTimeout;
    }

    logout() {
        localStorage.removeItem('blogSession');
        window.location.href = '/login';
    }
}

// Initialize security system
const securitySystem = new SecuritySystem();
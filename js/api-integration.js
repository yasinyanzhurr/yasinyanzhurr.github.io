class APIIntegration {
    constructor() {
        this.baseURL = '/api';
        this.initializeAPI();
    }

    async initializeAPI() {
        try {
            await this.validateConnection();
            this.setupInterceptors();
        } catch (error) {
            console.warn('API initialization warning:', error);
        }
    }

    setupInterceptors() {
        // Add authorization headers
        this.addRequestInterceptor(config => {
            config.headers.Authorization = `Bearer ${this.getAuthToken()}`;
            return config;
        });

        // Handle response errors
        this.addResponseInterceptor(
            response => response,
            error => {
                if (error.response.status === 401) {
                    securitySystem.logout();
                }
                return Promise.reject(error);
            }
        );
    }

    async makeRequest(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) throw new Error('API request failed');

            return await response.json();
        } catch (error) {
            console.warn('API request warning:', error);
            throw error;
        }
    }
}

// Initialize API integration
const apiIntegration = new APIIntegration();
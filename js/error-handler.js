class ErrorHandler {
    constructor() {
        this.initializeErrorHandling();
    }

    initializeErrorHandling() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.handleError(error);
            return false;
        };

        window.addEventListener('unhandledrejection', event => {
            this.handleError(event.reason);
        });
    }

    handleError(error) {
        console.warn('Non-critical error caught:', error);

        // Log error to analytics
        if (window.blogAnalytics) {
            try {
                window.blogAnalytics.logError({
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                });
            } catch (e) {
                console.warn('Error logging failed:', e);
            }
        }
    }
}

// Initialize error handler
const errorHandler = new ErrorHandler();
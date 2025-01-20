class Logger {
    constructor() {
        this.logLevel = 'info';
        this.logBuffer = [];
        this.maxBufferSize = 100;
        this.initializeLogger();
    }

    initializeLogger() {
        this.setupErrorLogging();
        this.setupPerformanceLogging();
        this.setupUserActivityLogging();
    }

    log(level, message, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            user: 'yasinyanzhurr',
            sessionId: this.getSessionId()
        };

        this.bufferLog(logEntry);

        if (level === 'error' || this.logBuffer.length >= this.maxBufferSize) {
            this.flushLogs();
        }
    }

    bufferLog(logEntry) {
        this.logBuffer.push(logEntry);
    }

    async flushLogs() {
        if (this.logBuffer.length === 0) return;

        try {
            await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.logBuffer)
            });

            this.logBuffer = [];
        } catch (error) {
            console.warn('Log flush warning:', error);
        }
    }

    logUserActivity(action, details) {
        this.log('info', 'User Activity', {
            action,
            details,
            timestamp: new Date().toISOString()
        });
    }

    logError(error) {
        this.log('error', error.message, {
            stack: error.stack,
            context: this.getErrorContext()
        });
    }

    getErrorContext() {
        return {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
    }
}
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.initializeNotifications();
    }

    async initializeNotifications() {
        try {
            await this.checkPermission();
            this.startNotificationListener();
        } catch (error) {
            console.warn('Notification initialization non-critical error:', error);
        }
    }

    async checkPermission() {
        if (Notification.permission !== 'granted') {
            try {
                const permission = await Notification.requestPermission();
                return permission === 'granted';
            } catch (error) {
                console.warn('Notification permission request failed:', error);
                return false;
            }
        }
        return true;
    }

    async startNotificationListener() {
        try {
            const supabase = createClient(this.supabaseUrl, this.supabaseKey);

            supabase
                .channel('public:comments')
                .on('INSERT', payload => {
                    this.showNotification('New Comment', payload.new);
                })
                .subscribe();
        } catch (error) {
            console.warn('Notification listener non-critical error:', error);
        }
    }

    showNotification(title, data) {
        if (Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: data.content,
                    icon: '/images/notification-icon.png',
                    tag: 'blog-notification'
                });
            } catch (error) {
                console.warn('Show notification non-critical error:', error);
            }
        }
    }
}

// Initialize notifications
const notificationSystem = new NotificationSystem();
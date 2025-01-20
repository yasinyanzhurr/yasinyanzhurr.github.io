class BlogAnalytics {
    constructor() {
        this.supabaseUrl = 'YOUR_SUPABASE_URL';
        this.supabaseKey = 'YOUR_SUPABASE_KEY';
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
        this.initializeAnalytics();
    }

    async initializeAnalytics() {
        try {
            // Track page view
            await this.trackPageView();
            // Initialize view counter
            await this.updateViewCount();
        } catch (error) {
            console.warn('Analytics initialization non-critical error:', error);
        }
    }

    async trackPageView() {
        const pageData = {
            url: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
        };

        try {
            await this.supabase
                .from('page_views')
                .insert([pageData]);
        } catch (error) {
            console.warn('Page view tracking non-critical error:', error);
        }
    }

    async updateViewCount() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/blog/')) {
            try {
                await this.supabase
                    .rpc('increment_post_views', {
                        post_path: currentPath
                    });
            } catch (error) {
                console.warn('View count update non-critical error:', error);
            }
        }
    }

    async getPostAnalytics(postId) {
        try {
            const { data, error } = await this.supabase
                .from('post_analytics')
                .select('*')
                .eq('post_id', postId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.warn('Post analytics fetch non-critical error:', error);
            return null;
        }
    }
}

// Initialize analytics
const blogAnalytics = new BlogAnalytics();
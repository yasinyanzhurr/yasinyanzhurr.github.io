# Panduan Deployment Blog System

## Persiapan Deployment

### 1. Persyaratan Sistem
- Node.js v14 atau lebih tinggi
- npm v6 atau lebih tinggi
- Database PostgreSQL
- Redis untuk caching
- Supabase account

### 2. Konfigurasi Environment
```bash
# .env file
DATABASE_URL=postgresql://user:password@localhost:5432/blog
REDIS_URL=redis://localhost:6379
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
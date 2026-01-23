# Regimen Prototype & Sync Setup

This project now includes a **Regimen Prototype** (`regimen.html`) alongside the main React application. This prototype is designed for speed and offline-first capability, with a manual sync to Supabase.

## 1. Database Requirement

To enable the "Cloud Sync" feature in the prototype, you must create the `REGI_daily_logs` table in your Supabase project.

### SQL Schema
Execute the contents of `src/data/regimen_schema.sql` in your Supabase SQL Editor:

```sql
-- Table for Daily Logs (Granular Sync)
CREATE TABLE IF NOT EXISTS public.REGI_daily_logs (
    user_id UUID REFERENCES auth.users NOT NULL,
    date DATE NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, date)
);

-- Enable RLS
ALTER TABLE public.REGI_daily_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own REGI logs" ON public.REGI_daily_logs
    FOR ALL USING (auth.uid() = user_id);
```

## 2. Deployment

The project is configured to build as a Single Page Application (SPA).
- **Main App:** `index.html` (React)
- **Prototype:** `regimen.html` (Vanilla JS/HTML)

When deploying to Vercel/Netlify/GitHub Pages:
1. Run `npm run build`
2. Deploy the `dist/` folder.

## 3. Usage

1. **Login:** Log in using the main React app (`/`).
2. **Choose Mode:** After login, select "Regimen Prototype".
3. **Sync:** In the prototype, click the green "SYNC TO CLOUD" button to back up your local logs to the database.

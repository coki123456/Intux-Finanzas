-- Intux Finanzas - PostgREST Schema Setup

-- 1. Create tables based on previous Prisma schema
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept TEXT NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    payer TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    currency TEXT DEFAULT 'ARS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    partner_a_name TEXT DEFAULT 'Lillo',
    partner_b_name TEXT DEFAULT 'Coki',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row for app_settings if it doesn't exist
INSERT INTO public.app_settings (id, partner_a_name, partner_b_name)
VALUES (1, 'Lillo', 'Coki')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Roles for PostgREST
-- The web_anon role is for unauthenticated requests (we won't give it any permissions)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'web_anon') THEN
    CREATE ROLE web_anon NOLOGIN;
  END IF;
END
$$;

-- The authenticator role is used to validate JWTs and perform authorized requests
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticator') THEN
    CREATE ROLE authenticator NOLOGIN;
  END IF;
END
$$;

-- Let authenticator act as web_anon (required by PostgREST)
GRANT web_anon TO authenticator;

-- 3. Grant Permissions
-- Deny access to web_anon
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM web_anon;

-- Grant permissions to authenticator
GRANT USAGE ON SCHEMA public TO authenticator;
GRANT ALL ON TABLE public.expenses TO authenticator;
GRANT ALL ON TABLE public.app_settings TO authenticator;

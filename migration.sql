-- 1. Add currency column to expenses table (default to ARS for existing records)
ALTER TABLE expenses 
ADD COLUMN currency text DEFAULT 'ARS';

-- 2. Create app_settings table for storing partner names
CREATE TABLE IF NOT EXISTS app_settings (
    id int PRIMARY KEY DEFAULT 1,
    partner_a_name text DEFAULT 'Socio A',
    partner_b_name text DEFAULT 'Socio B',
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Insert default settings row if it doesn't exist
INSERT INTO app_settings (id, partner_a_name, partner_b_name)
VALUES (1, 'Socio A', 'Socio B')
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS) on app_settings (Optional but good practice)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- 5. Create a policy to allow anyone to read/update settings (since it's a shared app)
-- or restricted based on your auth needs. For this app (no auth), we allow anonymous access as per existing pattern.
CREATE POLICY "Enable read access for all users" ON app_settings FOR SELECT USING (true);
CREATE POLICY "Enable update access for all users" ON app_settings FOR UPDATE USING (true);
CREATE POLICY "Enable insert access for all users" ON app_settings FOR INSERT WITH CHECK (true);

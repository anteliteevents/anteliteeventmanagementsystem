-- Demo accounts for quick logins
-- Safe to rerun; uses email-based upsert
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO users (id, email, password_hash, first_name, last_name, company_name, phone, role, is_active, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'demo.admin@antelite.com', '$2b$10$qg5Opb.quQFnEPmZIl0mAOw/HZFomPD46v0tsGG/Jhtuphzc95./u', 'Demo', 'Admin', 'Antelite Events', '+1-555-1111', 'admin', true, NOW(), NOW()),
  (uuid_generate_v4(), 'demo.exhibitor@antelite.com', '$2b$10$7L8hoFVysR8JD2sT6B.k2uLxcGvxsCo8ZxZrFGyTGTlKX1KSFD2Pi', 'Demo', 'Exhibitor', 'Showcase Corp', '+1-555-2222', 'exhibitor', true, NOW(), NOW()),
  (uuid_generate_v4(), 'demo.visitor@antelite.com', '$2b$10$8rXHS8kt1f/OHrFFSNKhyOL4cA/Q.fLkH6r4pVP/ej3zM0zYyLGMi', 'Demo', 'Visitor', 'Visitor LLC', '+1-555-3333', 'exhibitor', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      company_name = EXCLUDED.company_name,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      is_active = true,
      updated_at = NOW();

-- Summary output
DO $$
DECLARE
  rec RECORD;
BEGIN
  RAISE NOTICE 'Demo accounts inserted/updated:';
  FOR rec IN
    SELECT email, role FROM users WHERE email IN (
      'demo.admin@antelite.com',
      'demo.exhibitor@antelite.com',
      'demo.visitor@antelite.com'
    )
  LOOP
    RAISE NOTICE ' - % (% role)', rec.email, rec.role;
  END LOOP;
END$$;


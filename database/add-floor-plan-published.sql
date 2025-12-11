-- Add is_published column to floor_plans table
-- This allows floor plans to be published for public sales view

ALTER TABLE floor_plans 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Create index for faster queries on published floor plans
CREATE INDEX IF NOT EXISTS idx_floor_plans_is_published ON floor_plans(is_published);
CREATE INDEX IF NOT EXISTS idx_floor_plans_event_published ON floor_plans(event_id, is_published);


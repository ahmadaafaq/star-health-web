-- Database schema setup for Star Health Lead Management and Storage

-- 1. Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  email TEXT,
  phone TEXT,
  age INTEGER,
  members TEXT[],
  city TEXT,
  budget TEXT,
  pre_existing_diseases TEXT[],
  diabetes BOOLEAN,
  parents_included BOOLEAN,
  employer_insurance BOOLEAN,
  pregnancy_plan BOOLEAN,
  preferred_hospital TEXT,
  recommended_plan_id TEXT,
  ai_rank_score INTEGER,
  ai_rank_explanation TEXT,
  lead_type TEXT, -- 'hot', 'warm', 'cold'
  lead_status TEXT DEFAULT 'open' -- 'open', 'in_progress', 'communication', 'won', 'lost'
);

-- Enable RLS and configure policies for leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
DROP POLICY IF EXISTS "Allow public select" ON public.leads;
DROP POLICY IF EXISTS "Allow public update" ON public.leads;

CREATE POLICY "Allow public insert" ON public.leads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.leads FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update" ON public.leads FOR UPDATE TO public USING (true);


-- 2. Create policies bucket in storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('policies', 'policies', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Configure storage objects policies to allow public anonymous uploads & reads
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Select" ON storage.objects;

CREATE POLICY "Public Upload" ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'policies');

CREATE POLICY "Public Select" ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'policies');

-- 4. Create messages table for WhatsApp conversation logging
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  phone TEXT,
  direction TEXT, -- 'inbound', 'outbound'
  body TEXT,
  channel TEXT, -- 'whatsapp', 'sms'
  twilio_sid TEXT,
  message_type TEXT -- 'welcome', etc.
);

-- Enable RLS and configure policies for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public messages insert" ON public.messages;
DROP POLICY IF EXISTS "Allow public messages select" ON public.messages;

CREATE POLICY "Allow public messages insert" ON public.messages FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public messages select" ON public.messages FOR SELECT TO public USING (true);


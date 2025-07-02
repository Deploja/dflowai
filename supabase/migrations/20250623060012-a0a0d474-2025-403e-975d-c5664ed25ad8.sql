
-- Create contracts table to track consultant assignments
CREATE TABLE public.contracts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    consultant_id uuid NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
    client_name text NOT NULL,
    project_name text NOT NULL,
    contract_value decimal(10,2) NOT NULL,
    start_date date NOT NULL,
    end_date date,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create revenue table to track actual earnings
CREATE TABLE public.revenue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    consultant_id uuid NOT NULL REFERENCES public.consultants(id) ON DELETE CASCADE,
    amount decimal(10,2) NOT NULL,
    revenue_date date NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue ENABLE ROW LEVEL SECURITY;

-- Create policies for contracts
CREATE POLICY "Enable read access for all users" ON public.contracts
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.contracts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.contracts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.contracts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for revenue
CREATE POLICY "Enable read access for all users" ON public.revenue
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.revenue
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.revenue
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.revenue
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create updated_at triggers
CREATE TRIGGER handle_contracts_updated_at
    BEFORE UPDATE ON public.contracts
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_revenue_updated_at
    BEFORE UPDATE ON public.revenue
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_contracts_consultant_id ON public.contracts(consultant_id);
CREATE INDEX idx_contracts_start_date ON public.contracts(start_date);
CREATE INDEX idx_revenue_contract_id ON public.revenue(contract_id);
CREATE INDEX idx_revenue_consultant_id ON public.revenue(consultant_id);
CREATE INDEX idx_revenue_date ON public.revenue(revenue_date);

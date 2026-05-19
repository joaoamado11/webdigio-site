-- ============================================================
-- Webdigio v5 — Supabase Schema Migration
-- Run this in your Supabase SQL editor
-- ============================================================

-- ---- Enable UUID extension ----
create extension if not exists "uuid-ossp";

-- ---- site_content: key/value store for all editable copy ----
create table if not exists site_content (
  id uuid primary key default uuid_generate_v4(),
  section text not null,
  key text not null,
  value_pt text not null default '',
  value_en text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(section, key)
);

-- ---- services ----
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  title_pt text not null,
  title_en text not null,
  description_pt text not null default '',
  description_en text not null default '',
  icon text not null default 'laptop',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- portfolio ----
create table if not exists portfolio (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description_pt text not null default '',
  description_en text not null default '',
  image_url text not null default '',
  site_url text not null default '',
  tags text[] not null default '{}',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- testimonials ----
create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company text not null default '',
  avatar_url text not null default '',
  text_pt text not null default '',
  text_en text not null default '',
  rating int not null default 5 check (rating between 1 and 5),
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- faq ----
create table if not exists faq (
  id uuid primary key default uuid_generate_v4(),
  question_pt text not null,
  question_en text not null,
  answer_pt text not null default '',
  answer_en text not null default '',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- industries ----
create table if not exists industries (
  id uuid primary key default uuid_generate_v4(),
  label_pt text not null,
  label_en text not null,
  description_pt text not null default '',
  description_en text not null default '',
  image_url text not null default '',
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---- chatbot_config (single row) ----
create table if not exists chatbot_config (
  id int primary key default 1 check (id = 1),
  system_prompt_pt text not null default '',
  system_prompt_en text not null default '',
  greeting_pt text not null default 'Olá! Sou o assistente da Webdigio. Como posso ajudar?',
  greeting_en text not null default 'Hi! I am the Webdigio assistant. How can I help?',
  suggestions_pt text[] not null default '{"Quanto custa um site?","Quanto tempo demora?","O que está incluído?"}',
  suggestions_en text[] not null default '{"How much does a site cost?","How long does it take?","What is included?"}',
  active boolean not null default true,
  updated_at timestamptz default now()
);

-- Insert default chatbot config
insert into chatbot_config (id, system_prompt_pt, system_prompt_en)
values (1,
  'És o assistente virtual da Webdigio, uma agência digital portuguesa. Responde sempre em português europeu de forma amigável, concisa e profissional. A Webdigio cria websites profissionais por 690€ (pagamento único, sem mensalidades), com entrega em 2-5 dias. Inclui até 5 páginas, design responsivo, SEO base, integração WhatsApp, domínio e alojamento no 1º ano. Não dês informações de preços diferentes dos oficiais. Encoraja o utilizador a entrar em contacto pelo WhatsApp ou email para saber mais.',
  'You are the virtual assistant of Webdigio, a Portuguese digital agency. Always respond in English in a friendly, concise and professional manner. Webdigio creates professional websites for €690 (one-time payment, no subscriptions), with delivery in 2-5 days. Includes up to 5 pages, responsive design, basic SEO, WhatsApp integration, domain and hosting in the 1st year. Do not give pricing information different from official prices. Encourage the user to contact via WhatsApp or email to learn more.'
)
on conflict (id) do nothing;

-- ---- seo_config (single row) ----
create table if not exists seo_config (
  id int primary key default 1 check (id = 1),
  title_pt text not null default 'Webdigio — Agência Digital Premium | Design & Desenvolvimento',
  title_en text not null default 'Webdigio — Premium Digital Agency | Design & Development',
  description_pt text not null default 'Webdigio — Agência digital premium. Design, desenvolvimento e performance para negócios que querem crescer online.',
  description_en text not null default 'Webdigio — Premium digital agency. Design, development and performance for businesses that want to grow online.',
  og_image_url text not null default '',
  canonical_url text not null default 'https://webdigio.pt',
  updated_at timestamptz default now()
);

insert into seo_config (id) values (1) on conflict (id) do nothing;

-- ---- pricing (single row for the main package) ----
create table if not exists pricing (
  id int primary key default 1 check (id = 1),
  name_pt text not null default 'O seu site profissional',
  name_en text not null default 'Your professional website',
  badge_pt text not null default 'Site Express',
  badge_en text not null default 'Express Site',
  description_pt text not null default 'Tudo incluído para começar a receber clientes online. Entrega em 2 a 5 dias.',
  description_en text not null default 'Everything included to start receiving clients online. Delivery in 2 to 5 days.',
  price numeric not null default 690,
  currency text not null default 'EUR',
  whatsapp_number text not null default '351912345678',
  email_address text not null default 'geral@webdigio.pt',
  updated_at timestamptz default now()
);

insert into pricing (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- Row-Level Security
-- ============================================================

-- Enable RLS on all tables
alter table site_content enable row level security;
alter table services enable row level security;
alter table portfolio enable row level security;
alter table testimonials enable row level security;
alter table faq enable row level security;
alter table industries enable row level security;
alter table chatbot_config enable row level security;
alter table seo_config enable row level security;
alter table pricing enable row level security;

-- Public READ for all tables (anon key)
create policy "Public read site_content"    on site_content    for select using (true);
create policy "Public read services"        on services        for select using (true);
create policy "Public read portfolio"       on portfolio       for select using (true);
create policy "Public read testimonials"    on testimonials    for select using (true);
create policy "Public read faq"             on faq             for select using (true);
create policy "Public read industries"      on industries      for select using (true);
create policy "Public read chatbot_config"  on chatbot_config  for select using (true);
create policy "Public read seo_config"      on seo_config      for select using (true);
create policy "Public read pricing"         on pricing         for select using (true);

-- Authenticated WRITE for all tables (admin users only)
create policy "Auth write site_content"    on site_content    for all using (auth.role() = 'authenticated');
create policy "Auth write services"        on services        for all using (auth.role() = 'authenticated');
create policy "Auth write portfolio"       on portfolio       for all using (auth.role() = 'authenticated');
create policy "Auth write testimonials"    on testimonials    for all using (auth.role() = 'authenticated');
create policy "Auth write faq"             on faq             for all using (auth.role() = 'authenticated');
create policy "Auth write industries"      on industries      for all using (auth.role() = 'authenticated');
create policy "Auth write chatbot_config"  on chatbot_config  for all using (auth.role() = 'authenticated');
create policy "Auth write seo_config"      on seo_config      for all using (auth.role() = 'authenticated');
create policy "Auth write pricing"         on pricing         for all using (auth.role() = 'authenticated');

-- ============================================================
-- Seed default data
-- ============================================================

-- Services
insert into services (title_pt, title_en, description_pt, description_en, icon, sort_order) values
('Site Express',         'Express Site',       'Website profissional até 5 páginas. Design moderno, mobile-first e SEO incluído. Entrega em 2 a 5 dias.', 'Professional website up to 5 pages. Modern design, mobile-first and SEO included. Delivery in 2 to 5 days.', 'laptop', 1),
('SEO + Copywriting IA', 'SEO + AI Copywriting','Textos otimizados com inteligência artificial para aparecer nas pesquisas do Google. Copywriting profissional incluído.', 'AI-optimised texts to appear in Google searches. Professional copywriting included.', 'search', 2),
('Integrações',          'Integrations',        'WhatsApp, email, redes sociais, formulários e ferramentas externas — tudo ligado ao teu site.', 'WhatsApp, email, social media, forms and external tools — all connected to your site.', 'nodes', 3),
('WhatsApp + Redes',     'WhatsApp + Social',   'WhatsApp, email, redes sociais — tudo integrado para os seus clientes contactarem de forma rápida e direta.', 'WhatsApp, email, social media — all integrated for your clients to reach you quickly and directly.', 'whatsapp', 4),
('Backend Editável',     'Editable Backend',    'Painel de administração simples para gerir conteúdos, atualizar informações e manter o site sempre relevante.', 'Simple admin panel to manage content, update information and keep the site always relevant.', 'backend', 5),
('Mobile-First',         'Mobile-First',        'Design responsivo que se adapta a qualquer ecrã. Smartphone, tablet ou desktop — o site fica sempre perfeito.', 'Responsive design that adapts to any screen. Smartphone, tablet or desktop — always perfect.', 'mobile', 6)
on conflict do nothing;

-- Industries
insert into industries (label_pt, label_en, description_pt, description_en, image_url, sort_order) values
('Saúde & Clínicas',            'Health & Clinics',          'Médicos, dentistas, fisioterapeutas e clínicas especializadas.', 'Doctors, dentists, physiotherapists and specialist clinics.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80', 1),
('Estética & Bem-Estar',        'Beauty & Wellness',         'Cabeleireiros, barbeiros, spas e centros de estética.', 'Hairdressers, barbers, spas and beauty centres.', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80', 2),
('Restauração',                 'Food & Drink',              'Restaurantes, cafés, pastelarias e bares.', 'Restaurants, cafés, pastry shops and bars.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', 3),
('Serviços Técnicos',           'Technical Services',        'Eletricistas, canalizadores e serviços de reparação.', 'Electricians, plumbers and repair services.', 'https://images.unsplash.com/photo-1581147036324-1d2facfada54?auto=format&fit=crop&w=800&q=80', 4),
('Profissionais Independentes', 'Independent Professionals', 'Advogados, consultores, contabilistas e freelancers.', 'Lawyers, consultants, accountants and freelancers.', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80', 5),
('Comércio Local',              'Local Commerce',            'Lojas, mercearias e negócios de bairro.', 'Shops, grocers and neighbourhood businesses.', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80', 6)
on conflict do nothing;

-- FAQ
insert into faq (question_pt, question_en, answer_pt, answer_en, sort_order) values
('Como funciona o processo?', 'How does the process work?', 'Falamos 15 minutos, percebemos o seu negócio, criamos o site em 2 a 5 dias e entregamos. Depois enviamos um formulário para refinar o conteúdo. Simples, rápido e sem complicações.', 'We talk for 15 minutes, understand your business, create the site in 2 to 5 days and deliver. Then we send a form to refine the content. Simple, fast and no complications.', 1),
('Quanto custa um site?', 'How much does a website cost?', 'O Site Express custa 690€ — pagamento único, sem mensalidades. Inclui até 5 páginas, design responsivo, SEO base, integração WhatsApp, domínio e alojamento no primeiro ano.', 'The Express Site costs €690 — one-time payment, no subscriptions. Includes up to 5 pages, responsive design, basic SEO, WhatsApp integration, domain and hosting in the first year.', 2),
('Preciso de fornecer textos e imagens?', 'Do I need to provide texts and images?', 'Não. Criamos o site com informação mínima sua. Depois da entrega, enviamos um formulário para recolher detalhes adicionais e melhorar o conteúdo.', 'No. We create the site with minimal information from you. After delivery, we send a form to collect additional details and improve the content.', 3),
('O site fica otimizado para o Google?', 'Is the site optimised for Google?', 'Sim. Todos os sites incluem SEO base: estrutura otimizada, meta tags, headings corretos, velocidade de carregamento e design responsivo. Tudo o que o Google valoriza.', 'Yes. All sites include basic SEO: optimised structure, meta tags, correct headings, loading speed and responsive design. Everything Google values.', 4),
('Posso atualizar o site depois de entregue?', 'Can I update the site after delivery?', 'Sim. Oferecemos suporte pós-entrega para ajustes e atualizações. Se precisar de alterações maiores, temos serviços adicionais com preços transparentes.', 'Yes. We offer post-delivery support for adjustments and updates. If you need larger changes, we have additional services with transparent pricing.', 5),
('Quanto tempo demora a entrega?', 'How long does delivery take?', '2 a 5 dias úteis para a versão inicial do site. Os ajustes finais demoram mais 1 a 2 dias. No total, em menos de uma semana o seu site está pronto.', '2 to 5 business days for the initial version. Final adjustments take an additional 1 to 2 days. In total, in less than a week your site is ready.', 6)
on conflict do nothing;

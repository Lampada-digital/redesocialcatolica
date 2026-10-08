-- ============================================
-- COMMUNIO - Seed Data for Development
-- ============================================

-- Insert demo dioceses
INSERT INTO dioceses (id, name, slug, bishop_name, city, state, country, website, description, is_verified) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'Diocese de São Miguel Paulista', 'diocese-sao-miguel-paulista', 'Dom Pedro Carlos Cipollini', 'São Paulo', 'SP', 'Brasil', 'www.diocesesmp.org.br', 'Diocese de São Miguel Paulista, fundada em 1989.', true),
  ('d2222222-2222-2222-2222-222222222222', 'Diocese de Santo Amaro', 'diocese-santo-amaro', 'Dom José Nelson Westrupp', 'São Paulo', 'SP', 'Brasil', 'www.diocedesantoamaro.org.br', 'Diocese de Santo Amaro.', true),
  ('d3333333-3333-3333-3333-333333333333', 'Arquidiocese de São Sebastião do Rio de Janeiro', 'arquidiocese-rio-de-janeiro', 'Cardeal Orani João Tempesta', 'Rio de Janeiro', 'RJ', 'Brasil', 'www.arquirio.org', 'Arquidiocese de São Sebastião do Rio de Janeiro.', true)
ON CONFLICT (id) DO NOTHING;

-- Insert demo parishes
INSERT INTO parishes (id, diocese_id, name, slug, address, city, state, country, phone, website, mass_schedule, description, is_verified) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Paróquia São José', 'paroquia-sao-jose', 'Rua São José, 123 - Centro', 'São Paulo', 'SP', 'Brasil', '(11) 2345-6789', 'www.parquiasaojose.com.br', '[{"day": "Segunda a Sexta", "times": ["7h", "19h"]}, {"day": "Sábado", "times": ["8h", "18h"]}, {"day": "Domingo", "times": ["7h", "9h", "11h", "18h"]}]', 'Paróquia São José, comunidade acolhedora no coração de São Paulo.', true),
  ('p2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Paróquia Nossa Senhora Aparecida', 'paroquia-ns-aparecida', 'Av. Aparecida, 456', 'São Paulo', 'SP', 'Brasil', '(11) 2456-7890', NULL, '[{"day": "Segunda a Sexta", "times": ["6h30", "19h30"]}, {"day": "Sábado", "times": ["17h"]}, {"day": "Domingo", "times": ["7h", "9h30", "18h"]}]', 'Paróquia Nossa Senhora Aparecida, dedicada à Padroeira do Brasil.', true),
  ('p3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Catedral São Miguel Arcanjo', 'catedral-sao-miguel-arcanjo', 'Praça Catedral, 1', 'São Paulo', 'SP', 'Brasil', '(11) 2567-8901', 'www.catedralsmp.com.br', '[{"day": "Segunda a Sexta", "times": ["7h", "18h"]}, {"day": "Sábado", "times": ["9h", "17h"]}, {"day": "Domingo", "times": ["7h", "10h", "12h", "17h", "19h"]}]', 'Catedral da Diocese de São Miguel Paulista.', true),
  ('p4444444-4444-4444-4444-444444444444', 'd1111111-1111-1111-1111-111111111111', 'Paróquia Sagrado Coração de Jesus', 'paroquia-sagrado-coracao', 'Rua do Coração, 789', 'São Paulo', 'SP', 'Brasil', '(11) 2678-9012', NULL, '[{"day": "Terça a Sexta", "times": ["19h"]}, {"day": "Sábado", "times": ["18h"]}, {"day": "Domingo", "times": ["8h", "10h", "19h"]}]', 'Paróquia do Sagrado Coração de Jesus.', true)
ON CONFLICT (id) DO NOTHING;

-- Insert demo pastorals
INSERT INTO pastorals (id, parish_id, name, description) VALUES
  ('pa1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Pastoral da Juventude', 'Grupo de jovens da paróquia'),
  ('pa2222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', 'Pastoral da Catequese', 'Catequese para crianças e adultos'),
  ('pa3333333-3333-3333-3333-333333333333', 'p1111111-1111-1111-1111-111111111111', 'Pastoral Familiar', 'Acompanhamento de famílias'),
  ('pa4444444-4444-4444-4444-444444444444', 'p1111111-1111-1111-1111-111111111111', 'Pastoral da Música', 'Ministério de música litúrgica'),
  ('pa5555555-5555-5555-5555-555555555555', 'p1111111-1111-1111-1111-111111111111', 'Pastoral do Dízimo', 'Educação e partilha'),
  ('pa6666666-6666-6666-6666-666666666666', 'p2222222-2222-2222-2222-222222222222', 'Pastoral da Juventude', 'Grupo de jovens da paróquia'),
  ('pa7777777-7777-7777-7777-777777777777', 'p2222222-2222-2222-2222-222222222222', 'Pastoral do Batismo', 'Preparação para o batismo')
ON CONFLICT (id) DO NOTHING;

-- Note: User-related data (profiles, posts, communities, etc.) should be created
-- through the application's registration and creation flows.
-- The seed data above provides the ecclesiastical structure (dioceses, parishes, pastorals)
-- that exists independently of user accounts.

-- ============================================================
-- SEED: Dados iniciais para testes
-- Idempotente: pode ser executado múltiplas vezes
-- ============================================================

-- Limpa os dados existentes e reinicia os contadores de ID
TRUNCATE TABLE
    avaliacoes,
    bibliotecas,
    jogo_genero,
    jogo_plataforma,
    jogos,
    usuarios,
    generos,
    plataformas,
    desenvolvedoras
RESTART IDENTITY CASCADE;

-- Desenvolvedoras (IDs 1..11)
INSERT INTO desenvolvedoras (nome, pais, created_at, updated_at) VALUES
('Nintendo',            'Japão',      NOW(), NOW()),  -- 1
('Rockstar Games',      'EUA',        NOW(), NOW()),  -- 2
('CD Projekt Red',      'Polônia',    NOW(), NOW()),  -- 3
('FromSoftware',        'Japão',      NOW(), NOW()),  -- 4
('Santa Monica Studio', 'EUA',        NOW(), NOW()),  -- 5
('Naughty Dog',         'EUA',        NOW(), NOW()),  -- 6
('Ubisoft',             'França',     NOW(), NOW()),  -- 7
('Electronic Arts',     'EUA',        NOW(), NOW()),  -- 8  ← corrigido (era "EA Sports")
('Valve',               'EUA',        NOW(), NOW()),  -- 9
('Square Enix',         'Japão',      NOW(), NOW()),  -- 10
('Team Cherry',         'Austrália',  NOW(), NOW());  -- 11

-- Gêneros (IDs 1..7)
INSERT INTO generos (nome, created_at, updated_at) VALUES
('Ação',         NOW(), NOW()),  -- 1
('RPG',          NOW(), NOW()),  -- 2
('Aventura',     NOW(), NOW()),  -- 3
('Esporte',      NOW(), NOW()),  -- 4
('Soulslike',    NOW(), NOW()),  -- 5
('Mundo Aberto', NOW(), NOW()),  -- 6
('Puzzle',       NOW(), NOW());  -- 7

-- Plataformas (IDs 1..4)
INSERT INTO plataformas (nome, created_at, updated_at) VALUES
('PC',              NOW(), NOW()),  -- 1
('PlayStation 5',   NOW(), NOW()),  -- 2
('Xbox Series X',   NOW(), NOW()),  -- 3
('Nintendo Switch', NOW(), NOW());  -- 4

-- Usuários (IDs 1..10)
INSERT INTO usuarios (nome, email, created_at, updated_at) VALUES
('Ana Silva',       'ana@email.com',       NOW(), NOW()),  -- 1
('Bruno Costa',     'bruno@email.com',     NOW(), NOW()),  -- 2
('Carlos Souza',    'carlos@email.com',    NOW(), NOW()),  -- 3
('Diana Lima',      'diana@email.com',     NOW(), NOW()),  -- 4
('Eduardo Reis',    'eduardo@email.com',   NOW(), NOW()),  -- 5
('Fernanda Alves',  'fernanda@email.com',  NOW(), NOW()),  -- 6
('Gabriel Rocha',   'gabriel@email.com',   NOW(), NOW()),  -- 7
('Helena Martins',  'helena@email.com',    NOW(), NOW()),  -- 8
('Igor Pereira',    'igor@email.com',      NOW(), NOW()),  -- 9
('Julia Nunes',     'julia@email.com',     NOW(), NOW());  -- 10

-- Jogos (IDs 1..12)
INSERT INTO jogos (titulo, ano_lancamento, preco, descricao, desenvolvedora_id, created_at, updated_at) VALUES
('The Legend of Zelda: Breath of the Wild', 2017, 299.90, 'Aventura em mundo aberto',   1,  NOW(), NOW()),  -- 1
('Red Dead Redemption 2',                   2018, 249.90, 'Velho oeste realista',       2,  NOW(), NOW()),  -- 2
('The Witcher 3: Wild Hunt',                2015, 129.90, 'RPG de fantasia',            3,  NOW(), NOW()),  -- 3
('Elden Ring',                              2022, 249.90, 'Soulslike desafiador',       4,  NOW(), NOW()),  -- 4
('God of War Ragnarök',                     2022, 299.90, 'Mitologia nórdica',          5,  NOW(), NOW()),  -- 5
('The Last of Us Part II',                  2020, 199.90, 'Drama pós-apocalíptico',     6,  NOW(), NOW()),  -- 6
('Assassin''s Creed Valhalla',              2020, 199.90, 'Vikings em mundo aberto',    7,  NOW(), NOW()),  -- 7
('FIFA 23',                                 2022, 299.90, 'Futebol realista',           8,  NOW(), NOW()),  -- 8
('Half-Life: Alyx',                         2020, 149.90, 'VR imersivo',                9,  NOW(), NOW()),  -- 9
('Final Fantasy XVI',                       2023, 349.90, 'RPG de ação épico',          10, NOW(), NOW()),  -- 10
('Cyberpunk 2077',                          2020, 199.90, 'Futurista distópico',        3,  NOW(), NOW()),  -- 11
('Hollow Knight',                           2017,  46.99, 'Metroidvania indie',         11, NOW(), NOW());  -- 12

-- Relacionamentos N:N (Jogo x Gênero)
-- Gêneros: 1=Ação, 2=RPG, 3=Aventura, 4=Esporte, 5=Soulslike, 6=Mundo Aberto, 7=Puzzle
INSERT INTO jogo_genero (jogo_id, genero_id) VALUES
(1, 3), (1, 6),                         -- Zelda: Aventura, Mundo Aberto
(2, 1), (2, 3), (2, 6),                 -- RDR2: Ação, Aventura, Mundo Aberto
(3, 2), (3, 3), (3, 6),                 -- Witcher 3: RPG, Aventura, Mundo Aberto
(4, 2), (4, 5), (4, 6),                 -- Elden Ring: RPG, Soulslike, Mundo Aberto
(5, 1), (5, 3),                         -- God of War: Ação, Aventura
(6, 1), (6, 3),                         -- TLOU2: Ação, Aventura
(7, 1), (7, 2), (7, 6),                 -- AC Valhalla: Ação, RPG, Mundo Aberto
(8, 4),                                 -- FIFA 23: Esporte
(9, 1), (9, 3),                         -- HL Alyx: Ação, Aventura
(10, 1), (10, 2),                       -- FF XVI: Ação, RPG
(11, 1), (11, 2), (11, 6),              -- Cyberpunk: Ação, RPG, Mundo Aberto
(12, 3), (12, 7);                       -- Hollow Knight: Aventura, Puzzle

-- Relacionamentos N:N (Jogo x Plataforma)
-- Plataformas: 1=PC, 2=PS5, 3=Xbox Series X, 4=Switch
INSERT INTO jogo_plataforma (jogo_id, plataforma_id) VALUES
(1, 4),                                 -- Zelda: Switch
(2, 2), (2, 3),                         -- RDR2: PS5, Xbox
(3, 1), (3, 2), (3, 3),                 -- Witcher 3: PC, PS5, Xbox
(4, 1), (4, 2), (4, 3),                 -- Elden Ring: PC, PS5, Xbox
(5, 2),                                 -- God of War: PS5
(6, 2),                                 -- TLOU2: PS5
(7, 1), (7, 2), (7, 3),                 -- AC Valhalla: PC, PS5, Xbox
(8, 1), (8, 2), (8, 3),                 -- FIFA 23: PC, PS5, Xbox
(9, 1),                                 -- HL Alyx: PC
(10, 2),                                -- FF XVI: PS5
(11, 1), (11, 2), (11, 3),              -- Cyberpunk: PC, PS5, Xbox
(12, 1), (12, 4);                       -- Hollow Knight: PC, Switch

-- Biblioteca (jogos adquiridos pelos usuários)
INSERT INTO bibliotecas (usuario_id, jogo_id, horas_jogadas, data_aquisicao, created_at, updated_at) VALUES
(1, 1, 120.5, NOW(), NOW(), NOW()),
(1, 3,  80.0, NOW(), NOW(), NOW()),
(2, 2,  45.0, NOW(), NOW(), NOW()),
(2, 4, 150.0, NOW(), NOW(), NOW()),
(3, 5,  30.0, NOW(), NOW(), NOW());

-- Avaliações
INSERT INTO avaliacoes (usuario_id, jogo_id, nota, comentario, created_at, updated_at) VALUES
(1, 1, 5, 'Obra-prima!',                    NOW(), NOW()),
(1, 3, 4, 'Excelente RPG',                  NOW(), NOW()),
(2, 2, 5, 'Melhor jogo de mundo aberto',    NOW(), NOW()),
(2, 4, 5, 'Desafiador e recompensador',     NOW(), NOW()),
(3, 5, 3, 'Bom, mas precisa de patches',    NOW(), NOW());
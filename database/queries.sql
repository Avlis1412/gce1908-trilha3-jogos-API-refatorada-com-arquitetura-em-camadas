-- ============================================================
-- CONSULTAS SQL PARA OS ENDPOINTS DA API
-- Compatível com prisma/schema.prisma
-- ============================================================

-- ==========================================
-- ENDPOINT 1: Listar Jogos (com filtro e paginação)
-- Rota: GET /jogos?titulo=...&genero=...&page=1&limit=10
-- ==========================================
SELECT
    j.id,
    j.titulo,
    j.ano_lancamento,
    j.preco,
    j.desconto,
    j.descricao,
    d.nome AS desenvolvedora,
    COALESCE(array_agg(DISTINCT g.nome) FILTER (WHERE g.nome IS NOT NULL), '{}') AS generos
FROM jogos j
JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
LEFT JOIN jogo_genero jg ON j.id = jg.jogo_id
LEFT JOIN generos g ON jg.genero_id = g.id
WHERE j.deleted_at IS NULL
  AND d.deleted_at IS NULL
  AND ($1::text IS NULL OR j.titulo ILIKE '%' || $1 || '%')
  AND ($2::text IS NULL OR EXISTS (
        SELECT 1 FROM jogo_genero jg2
        JOIN generos g2 ON jg2.genero_id = g2.id
        WHERE jg2.jogo_id = j.id AND g2.nome = $2 AND g2.deleted_at IS NULL
      ))
GROUP BY j.id, j.titulo, j.ano_lancamento, j.preco, j.desconto, j.descricao, d.nome
ORDER BY j.titulo ASC
LIMIT $3 OFFSET $4;

-- ==========================================
-- ENDPOINT 2: Buscar Jogo por ID (com detalhes)
-- Rota: GET /jogos/:id
-- ==========================================
SELECT
    j.id,
    j.titulo,
    j.ano_lancamento,
    j.preco,
    j.desconto,
    j.descricao,
    d.nome AS desenvolvedora,
    COALESCE(array_agg(DISTINCT g.nome) FILTER (WHERE g.nome IS NOT NULL), '{}') AS generos,
    COALESCE(array_agg(DISTINCT p.nome) FILTER (WHERE p.nome IS NOT NULL), '{}') AS plataformas,
    COALESCE(ROUND(AVG(a.nota), 2), 0) AS media_avaliacoes,
    COUNT(DISTINCT a.id) AS total_avaliacoes
FROM jogos j
JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
LEFT JOIN jogo_genero jg ON j.id = jg.jogo_id
LEFT JOIN generos g ON jg.genero_id = g.id
LEFT JOIN jogo_plataforma jp ON j.id = jp.jogo_id
LEFT JOIN plataformas p ON jp.plataforma_id = p.id
LEFT JOIN avaliacoes a ON j.id = a.jogo_id AND a.deleted_at IS NULL
WHERE j.id = $1
  AND j.deleted_at IS NULL
GROUP BY j.id, j.titulo, j.ano_lancamento, j.preco, j.desconto, j.descricao, d.nome;

-- ==========================================
-- ENDPOINT 3: Criar Jogo
-- Rota: POST /jogos
-- ==========================================
INSERT INTO jogos (titulo, ano_lancamento, preco, descricao, desconto, desenvolvedora_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- ==========================================
-- ENDPOINT 4: Atualizar Jogo
-- Rota: PUT /jogos/:id
-- ==========================================
UPDATE jogos
SET titulo            = $1,
    ano_lancamento    = $2,
    preco             = $3,
    descricao         = $4,
    desconto          = $5,
    desenvolvedora_id = $6,
    updated_at        = now()
WHERE id = $7
  AND deleted_at IS NULL
RETURNING *;

-- ==========================================
-- ENDPOINT 5: Remover Jogo (soft delete)
-- Rota: DELETE /jogos/:id
-- ==========================================
UPDATE jogos
SET deleted_at = now(),
    updated_at = now()
WHERE id = $1
  AND deleted_at IS NULL
RETURNING *;

-- ==========================================
-- ENDPOINT 6: Biblioteca do Usuário
-- Rota: GET /usuarios/:id/biblioteca
-- ==========================================
SELECT
    j.id           AS jogo_id,
    j.titulo,
    j.preco,
    b.horas_jogadas,
    b.data_aquisicao,
    d.nome         AS desenvolvedora
FROM bibliotecas b
JOIN jogos j           ON b.jogo_id = j.id
JOIN desenvolvedoras d ON j.desenvolvedora_id = d.id
WHERE b.usuario_id = $1
  AND b.deleted_at IS NULL
  AND j.deleted_at IS NULL
ORDER BY b.data_aquisicao DESC;

-- ==========================================
-- ENDPOINT 7: Top Jogos Melhores Avaliados
-- Rota: GET /jogos/top-avaliados
-- ==========================================
SELECT
    j.id,
    j.titulo,
    ROUND(AVG(a.nota), 2) AS media_nota,
    COUNT(a.id)           AS total_avaliacoes
FROM jogos j
JOIN avaliacoes a ON j.id = a.jogo_id
WHERE j.deleted_at IS NULL
  AND a.deleted_at IS NULL
GROUP BY j.id, j.titulo
HAVING COUNT(a.id) >= 1                 -- ← era >= 2, alinhado com o código
ORDER BY media_nota DESC, total_avaliacoes DESC
LIMIT 5;

-- ==========================================
-- ENDPOINT 8: Registrar Avaliação (com UPSERT)
-- Rota: POST /avaliacoes
-- ==========================================
INSERT INTO avaliacoes (usuario_id, jogo_id, nota, comentario, created_at, updated_at)
VALUES ($1, $2, $3, $4, now(), now())
ON CONFLICT (usuario_id, jogo_id)
DO UPDATE SET
    nota       = EXCLUDED.nota,
    comentario = EXCLUDED.comentario,
    deleted_at = NULL,
    updated_at = now()
RETURNING *;
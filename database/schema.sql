-- ============================================================
-- BANCO DE DADOS: Plataforma de Jogos
-- SGBD: PostgreSQL
-- Compatível com prisma/schema.prisma
-- ============================================================

-- 1. Tabelas Base

CREATE TABLE desenvolvedoras (
    id          SERIAL PRIMARY KEY,
    nome        TEXT NOT NULL UNIQUE,
    pais        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE generos (
    id          SERIAL PRIMARY KEY,
    nome        TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE plataformas (
    id          SERIAL PRIMARY KEY,
    nome        TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMPTZ
);

CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nome        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMPTZ
);

-- 2. Tabela Principal: Jogos

CREATE TABLE jogos (
    id                SERIAL PRIMARY KEY,
    titulo            TEXT NOT NULL,
    ano_lancamento    INTEGER CHECK (ano_lancamento >= 1950),
    preco             NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (preco >= 0),
    descricao         TEXT,
    desconto          NUMERIC(10,2) DEFAULT 0.00,
    desenvolvedora_id INTEGER NOT NULL REFERENCES desenvolvedoras(id) ON DELETE RESTRICT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_jogos_titulo         ON jogos (titulo);
CREATE INDEX idx_jogos_desenvolvedora ON jogos (desenvolvedora_id);

-- 3. Relacionamentos N:N

CREATE TABLE jogo_genero (
    jogo_id    INTEGER NOT NULL REFERENCES jogos(id)    ON DELETE CASCADE,
    genero_id  INTEGER NOT NULL REFERENCES generos(id)  ON DELETE CASCADE,
    PRIMARY KEY (jogo_id, genero_id)
);

CREATE TABLE jogo_plataforma (
    jogo_id       INTEGER NOT NULL REFERENCES jogos(id)        ON DELETE CASCADE,
    plataforma_id INTEGER NOT NULL REFERENCES plataformas(id)  ON DELETE CASCADE,
    PRIMARY KEY (jogo_id, plataforma_id)
);

-- 4. Biblioteca do Usuário (N:N com atributos)

CREATE TABLE bibliotecas (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    jogo_id        INTEGER NOT NULL REFERENCES jogos(id)    ON DELETE CASCADE,
    horas_jogadas  NUMERIC(6,1) DEFAULT 0.0 CHECK (horas_jogadas >= 0),
    data_aquisicao TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at     TIMESTAMPTZ,
    UNIQUE (usuario_id, jogo_id)
);

CREATE INDEX idx_bibliotecas_usuario ON bibliotecas (usuario_id);

-- 5. Avaliações

CREATE TABLE avaliacoes (
    id          SERIAL PRIMARY KEY,
    usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    jogo_id     INTEGER NOT NULL REFERENCES jogos(id)    ON DELETE CASCADE,
    nota        INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMPTZ,
    UNIQUE (usuario_id, jogo_id)
);

CREATE INDEX idx_avaliacoes_jogo ON avaliacoes (jogo_id);
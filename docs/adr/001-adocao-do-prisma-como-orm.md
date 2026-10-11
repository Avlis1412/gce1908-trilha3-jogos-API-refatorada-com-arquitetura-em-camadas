# ADR 001 — Adocao do Prisma como ORM

## Status

Aceito

## Contexto

A API precisa acessar um banco PostgreSQL com modelo relacional nao trivial: 9 tabelas, dois relacionamentos N:N (jogo_genero e jogo_plataforma) e uma tabela associativa com atributos (biblioteca). O Trabalho 1 ja havia sido entregue com SQL puro, o que torna explicito o custo de manter queries manuais.

## Decisao

Adotar o Prisma ORM como unica forma de acesso ao banco. O schema fica em prisma/schema.prisma, as migracoes sao versionadas em prisma/migrations/ e toda operacao de banco passa pelo PrismaClient configurado em src/config/prisma.js. Nenhuma camada fora de src/repositories/ acessa o Prisma diretamente.

## Consequencias

### Positivas

- Schema como fonte da verdade
- Migracoes versionadas junto ao codigo
- Client tipado com autocomplete
- Seed reprodutivel com prisma/seed.js
- Isolamento do ORM via Repository

### Negativas

- Curva de aprendizado inicial
- Menos controle sobre SQL especifico
- Dependencia do ecossistema Prisma

### Mitigacoes

- PrismaClient como Singleton em src/config/prisma.js
- Regras de negocio em src/services/, que nao conhece o Prisma
- Erros do Prisma traduzidos para HTTP em src/middlewares/errorHandler.js

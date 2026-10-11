# GCET908 - Trilha 03: Plataforma de Jogos (Arquitetura MVC)

API REST completa para uma **Plataforma de Jogos** (estilo Steam), refatorada para **arquitetura MVC em camadas**, com **Prisma ORM**, persistência em **PostgreSQL**, **injeção de dependência via Factory**, **DTOs**, **erros customizados** e **soft delete**. Desenvolvida para o **Trabalho 3** da disciplina **GCET908 — Desenvolvimento de Software II**.

---

## Objetivo

Evoluir a API do Trabalho 2 (Prisma + Repositories) para uma arquitetura **MVC em camadas**, aplicando:

- **Separação de responsabilidades** (routes -> controllers -> services -> repositories)
- **Service Layer** com regras de negócio centralizadas
- **Factory Pattern** para montagem de services com injeção de dependência
- **DTOs** (Data Transfer Objects) para padronizar entrada/saída
- **Erros customizados** (`AppError` e subclasses)
- **Middleware de erro centralizado** com tradução de erros do Prisma
- **Validações de negócio** antes de tocar no banco

---

## Documentação Arquitetural

Além deste README, o repositório contém:

| Arquivo | Conteúdo |
|---|---|
| [`ARQUITETURA.md`](./ARQUITETURA.md) | Diagrama das camadas, responsabilidades, fluxo completo de requisição e justificativa dos padrões de projeto |
| [`docs/adr/001-adocao-do-prisma-como-orm.md`](./docs/adr/001-adocao-do-prisma-como-orm.md) | ADR sobre a escolha do Prisma como ORM |
| [`docs/adr/002-arquitetura-em-camadas-com-mvc.md`](./docs/adr/002-arquitetura-em-camadas-com-mvc.md) | ADR sobre a adoção da arquitetura em camadas com MVC |

---

## Estrutura do Projeto

```text
gce1908-trilha3-jogos-mvc/
├── database/                     # Scripts SQL de referência (Trilhas 1 e 2)
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
├── docs/
│   └── adr/                      # Architecture Decision Records
│       ├── 001-adocao-do-prisma-como-orm.md
│       └── 002-arquitetura-em-camadas-com-mvc.md
├── prisma/
│   ├── migrations/               # Migrations versionadas
│   ├── schema.prisma             # Fonte da verdade do modelo
│   └── seed.js                   # Seed reprodutível
├── src/
│   ├── config/
│   │   └── prisma.js             # Cliente Prisma (Singleton)
│   ├── controllers/              # Camada HTTP (req/res)
│   │   ├── jogosController.js
│   │   ├── usuariosController.js
│   │   └── avaliacoesController.js
│   ├── errors/                   # Erros customizados
│   │   ├── AppError.js
│   │   ├── NotFoundError.js
│   │   ├── UnauthorizedError.js
│   │   └── ValidationError.js
│   ├── factories/
│   │   └── ServiceFactory.js     # Monta services com seus repos
│   ├── middlewares/
│   │   └── errorHandler.js       # Tratamento centralizado de erros
│   ├── models/
│   │   └── dto/                  # Data Transfer Objects
│   │       ├── JogoDTO.js
│   │       ├── UsuarioDTO.js
│   │       ├── AvaliacaoDTO.js
│   │       ├── BibliotecaDTO.js
│   │       ├── DesenvolvedoraDTO.js
│   │       ├── GeneroDTO.js
│   │       └── PlataformaDTO.js
│   ├── repositories/             # Camada de acesso a dados (Prisma)
│   │   ├── jogosRepository.js
│   │   ├── usuariosRepository.js
│   │   └── avaliacoesRepository.js
│   ├── routes/                   # Definição de rotas HTTP
│   │   ├── index.js
│   │   ├── jogosRoutes.js
│   │   ├── usuariosRoutes.js
│   │   └── avaliacoesRoutes.js
│   ├── services/                 # Regras de negócio
│   │   ├── jogosService.js
│   │   ├── usuariosService.js
│   │   └── avaliacoesService.js
│   ├── utils/
│   │   ├── constants.js          # HTTP, mensagens, regras
│   │   ├── formatters.js         # Formatadores reutilizáveis
│   │   └── validators.js         # Validações reutilizáveis
│   ├── app.js                    # Configuração do Express
│   └── server.js                 # Ponto de entrada
├── docker-compose.yml            # Bônus: banco em container
├── .env.example
├── .eslintrc.json
├── .eslintignore
├── .gitignore
├── ARQUITETURA.md
├── package.json
└── README.md
```

---

## Arquitetura em Camadas

O fluxo de uma requisição segue esta ordem:

### Diagrama das Camadas

```mermaid
flowchart TD
    Cliente([Cliente HTTP])
    Routes[Routes<br/>Definicao de URLs]
    Controllers[Controllers<br/>Traducao HTTP - Dominio]
    Services[Services<br/>Regras de Negocio]
    Repositories[Repositories<br/>Acesso a Dados]
    Prisma[(Prisma ORM)]
    DB[(PostgreSQL)]
    Middleware[Middleware de Erros<br/>Preocupacao Transversal]

    Cliente -->|requisicao| Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Prisma
    Prisma --> DB
    DB -. resposta .-> Prisma
    Prisma -. resposta .-> Repositories
    Repositories -. resposta .-> Services
    Services -. resposta .-> Controllers
    Controllers -. resposta .-> Routes
    Routes -. resposta .-> Cliente

    Controllers -. erro .-> Middleware
    Services -. erro .-> Middleware
    Repositories -. erro .-> Middleware
    Middleware -. resposta de erro .-> Cliente

    style Cliente fill:#4A90E2,color:#fff
    style Routes fill:#7B68EE,color:#fff
    style Controllers fill:#50C878,color:#fff
    style Services fill:#FFB84D,color:#000
    style Repositories fill:#E85D75,color:#fff
    style Prisma fill:#9B59B6,color:#fff
    style DB fill:#34495E,color:#fff
    style Middleware fill:#95A5A6,color:#fff
```

### Fluxo Completo de uma Requisição

Exemplo: `POST /api/jogos` com JSON no corpo.

```mermaid
sequenceDiagram
    autonumber
    participant C as Cliente
    participant R as Routes
    participant CT as Controller
    participant S as Service
    participant RP as Repository
    participant P as Prisma
    participant D as PostgreSQL

    C->>R: POST /api/jogos (JSON)
    activate R
    R->>CT: jogosController.criar
    deactivate R

    activate CT
    Note over CT: Le req.body<br/>valida presenca dos campos
    CT->>S: jogosService.criar(dados)
    deactivate CT

    activate S
    Note over S: Aplica regras de negocio<br/>valida titulo, preco, desconto
    S->>RP: jogosRepository.criar(dados)
    deactivate S

    activate RP
    RP->>P: prisma.jogo.create(...)
    deactivate RP

    activate P
    P->>D: INSERT INTO jogos
    deactivate P

    activate D
    D-->>P: registro criado
    deactivate D

    P-->>RP: objeto Jogo
    RP-->>S: objeto Jogo
    S-->>CT: objeto Jogo
    CT-->>R: res.status(201).json(jogo)
    R-->>C: 201 Created + JSON
```

### Fluxo de Erro (mesmo endpoint)

```mermaid
sequenceDiagram
    autonumber
    participant C as Cliente
    participant CT as Controller
    participant S as Service
    participant RP as Repository
    participant P as Prisma
    participant EH as errorHandler

    C->>CT: POST /api/jogos (JSON invalido)
    CT->>S: jogosService.criar(dados)
    S->>S: ValidationError lancado
    S--x CT: throw ValidationError
    CT->>EH: next(error)
    Note over EH: Identifica instanceof AppError<br/>usa error.statusCode
    EH-->>C: 400 Bad Request + JSON formatado
```

### Responsabilidade de cada camada

| Camada | Responsabilidade | Não deve fazer |
|---|---|---|
| **routes** | Mapear URL + método HTTP para controller | Conter lógica |
| **controllers** | Ler `req`, chamar service, responder com `res` | Conter SQL ou regras de negócio |
| **services** | Validar, orquestrar, decidir | Conhecer `req`/`res` |
| **repositories** | Executar queries Prisma | Conter regras de negócio |
| **DTOs** | Padronizar formato de entrada/saída | Executar queries |
| **middlewares** | Tratamento centralizado de erros | Conter lógica de negócio |

### Regra fundamental

**Nenhuma camada acessa outra pulando níveis.** O controller não fala com o repository diretamente; o service não conhece `req` nem `res`. Cada camada só conhece a camada imediatamente abaixo.

> Para detalhes adicionais sobre cada decisão arquitetural, consulte o [`ARQUITETURA.md`](./ARQUITETURA.md).

---

## Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    DESENVOLVEDORA ||--o{ JOGO : desenvolve
    JOGO ||--o{ JOGO_GENERO : pertence
    GENERO ||--o{ JOGO_GENERO : classifica
    JOGO ||--o{ JOGO_PLATAFORMA : disponivel
    PLATAFORMA ||--o{ JOGO_PLATAFORMA : hospeda
    USUARIO ||--o{ BIBLIOTECA : possui
    JOGO ||--o{ BIBLIOTECA : esta_em
    USUARIO ||--o{ AVALIACAO : avalia
    JOGO ||--o{ AVALIACAO : recebe

    DESENVOLVEDORA {
        int id PK
        string nome UK
        string pais
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    JOGO {
        int id PK
        string titulo
        int ano_lancamento
        decimal preco
        decimal desconto
        string descricao
        int desenvolvedora_id FK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    GENERO {
        int id PK
        string nome UK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    PLATAFORMA {
        int id PK
        string nome UK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    JOGO_GENERO {
        int jogo_id PK,FK
        int genero_id PK,FK
    }
    JOGO_PLATAFORMA {
        int jogo_id PK,FK
        int plataforma_id PK,FK
    }
    USUARIO {
        int id PK
        string nome
        string email UK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    BIBLIOTECA {
        int id PK
        int usuario_id FK
        int jogo_id FK
        decimal horas_jogadas
        datetime data_aquisicao
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
    AVALIACAO {
        int id PK
        int usuario_id FK
        int jogo_id FK
        int nota
        string comentario
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
```

---

## Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Git

### 1. Clonar e instalar

```bash
git clone https://github.com/Avlis1412/gce1908-trilha3-jogos-mvc.git
cd gce1908-trilha3-jogos-mvc
npm install
```

### 2. Configurar o `.env`

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Edite com suas credenciais:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/jogos_db?schema=public"
```

### 3. Criar o banco

No pgAdmin ou psql:

```sql
CREATE DATABASE jogos_db;
```

### 4. Rodar as migrations

```bash
npx prisma migrate dev
```

Isso aplica todas as migrations versionadas e gera o Prisma Client.

### 5. Popular o banco (seed)

```bash
npx prisma db seed
```

### 6. Rodar a API

```bash
npm run dev
```

Saída esperada:

```text
===============================================================
  API gce1908-trilha3-jogos (MVC)
===============================================================
  Servidor rodando na porta 3000
  http://localhost:3000/api
  Ambiente: development
===============================================================
```

### 7. Qualidade de código (ESLint)

```bash
npm run lint          # verifica
npm run lint:fix      # corrige automaticamente
```

---

## Alternativa com Docker (bônus)

Se preferir, suba o banco via Docker Compose:

```bash
docker compose up -d
```

Isso cria um PostgreSQL 16 na porta 5432 com usuário `postgres`, senha `postgres` e banco `jogos_db`.

---

## Endpoints

### Jogos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/jogos` | Lista todos os jogos ativos |
| GET | `/api/jogos/:id` | Detalhes com relacionamentos |
| GET | `/api/jogos/top-avaliados` | Top jogos por média de avaliação |
| POST | `/api/jogos` | Cria jogo (com gêneros e plataformas) |
| PUT | `/api/jogos/:id` | Atualiza jogo |
| DELETE | `/api/jogos/:id` | Soft delete (`deleted_at`) |

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/api/jogos \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Baldur'\''s Gate 3",
    "anoLancamento": 2023,
    "preco": 199.90,
    "descricao": "RPG por turnos",
    "desconto": 0,
    "desenvolvedoraId": 3,
    "generos": [2, 3],
    "plataformas": [1, 2]
  }'
```

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/usuarios` | Lista usuários ativos |
| GET | `/api/usuarios/:id` | Busca por ID |
| GET | `/api/usuarios/:id/biblioteca` | Biblioteca do usuário |
| POST | `/api/usuarios` | Cria usuário |
| PUT | `/api/usuarios/:id` | Atualiza |
| DELETE | `/api/usuarios/:id` | Soft delete |

### Avaliações

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/avaliacoes` | Registra/atualiza avaliação (UPSERT transacional) |
| GET | `/api/avaliacoes/jogo/:jogoId` | Avaliações de um jogo |

Exemplo de avaliação (UPSERT):

```bash
curl -X POST http://localhost:3000/api/avaliacoes \
  -H "Content-Type: application/json" \
  -d '{"usuarioId": 1, "jogoId": 2, "nota": 5, "comentario": "Excelente!"}'
```

Se o usuário já avaliou o jogo, a avaliação é atualizada em vez de duplicada (graças à constraint `@@unique([usuarioId, jogoId])`).

---

## Padrões de Projeto Aplicados

| Padrão | Onde está | Problema que resolve |
|---|---|---|
| **MVC** | Arquitetura geral | Separa a tradução HTTP do domínio |
| **Repository** | `src/repositories/` | Isola o acesso ao Prisma do resto da aplicação |
| **Service Layer** | `src/services/` | Concentra regras de negócio fora do controller |
| **DTO** | `src/models/dto/` | Desacopla formato de entrada/saída das entidades |
| **Factory** | `src/factories/ServiceFactory.js` | Centraliza a criação de services com suas dependências |
| **Dependency Injection** | Constructors dos services | Facilita testes (repositórios podem ser substituídos) |
| **Singleton** | `src/config/prisma.js` | Uma única instância do PrismaClient (evita múltiplas conexões) |
| **Soft Delete** | `deletedAt` em todos os models | Preserva histórico de dados |
| **Middleware Chain** | `src/middlewares/errorHandler.js` | Tratamento centralizado de erros |

---

## Boas Práticas Aplicadas

### ORM e Migrations

- Schema declarativo (`schema.prisma`) como fonte da verdade
- 2 migrations versionadas: `initial_schema` e `add_desconto_jogo`
- Seed reprodutível com `prisma/seed.js`
- Prisma Client gerado automaticamente

### Integridade e Transações

- Validação de FK antes de criar avaliações (transação)
- UPSERT com ON CONFLICT para avaliações idempotentes
- Soft delete via `deletedAt`
- Erros do Prisma traduzidos: P2002 -> 409, P2003 -> 400, P2025 -> 404

### Performance

- Batching automático do Prisma (evita N+1)
- Índices em `titulo`, `desenvolvedora_id`, `usuario_id`, `jogo_id`
- Filtro de soft delete em todas as queries (`deletedAt: null`)

### Arquitetura

- Separação em camadas: routes -> controllers -> services -> repositories
- Arrow functions nos controllers — evita o problema do `this` perdido
- Middleware de erro centralizado
- AppError e subclasses para erros de negócio
- DTOs isolam o formato do banco do formato da API

### Qualidade de Código

- ESLint configurado (`.eslintrc.json`)
- Ausência de dependências circulares
- Nenhum acesso direto ao Prisma fora da camada de persistência
- Nenhuma regra de negócio dentro dos controllers

### Auditoria

- `created_at`, `updated_at` (com `@updatedAt`) e `deleted_at` em todas as tabelas principais

---

## Testando Erros de Integridade

UNIQUE violation (409):

```bash
curl.exe -X POST http://localhost:3000/api/usuarios `
  -H "Content-Type: application/json" `
  -d '{\"nome\":\"Teste\",\"email\":\"ana@email.com\"}'
```

Retorno: `{"status":"error","tipo":"ConflictError","message":"Registro duplicado..."}`

FK violation (400):

```bash
curl.exe -X POST http://localhost:3000/api/jogos `
  -H "Content-Type: application/json" `
  -d '{\"titulo\":\"X\",\"anoLancamento\":2024,\"preco\":10,\"desenvolvedoraId\":99999}'
```

Retorno: `{"status":"error","tipo":"ForeignKeyError","message":"Referência inválida..."}`

404:

```bash
curl.exe http://localhost:3000/api/jogos/99999
```

Retorno: `{"status":"error","tipo":"NotFoundError","message":"Jogo não encontrado"}`

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Banco | PostgreSQL 14+ |
| ORM | Prisma 6.19.3 |
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Lint | ESLint 8 |
| Dev | nodemon |
| Container | Docker Compose (bônus) |

---

## Evolução do Projeto

| Trilha | Foco | Arquitetura |
|---|---|---|
| Trilha 1 | SQL puro (DDL, DML, JOINs) | Scripts `.sql` |
| Trilha 2 | Prisma ORM + Migrations | routes -> controllers -> repositories |
| Trilha 3 | Arquitetura MVC em camadas | routes -> controllers -> services -> repositories |

---

## Variáveis de Ambiente

O arquivo `.env` não é versionado (contém senhas). Use o `.env.example` como molde:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/jogos_db?schema=public"
```

---

## Autor

**Adriano Rodrigues da Silva**

- Matrícula: 2025133735
- Curso: Licenciatura em Computação (EaD/UAB) — UFRB
- Disciplina: GCET908 — Desenvolvimento de Software II
- Professor: Tássio Valle

---

## Licença

Projeto acadêmico desenvolvido para a disciplina GCET908.
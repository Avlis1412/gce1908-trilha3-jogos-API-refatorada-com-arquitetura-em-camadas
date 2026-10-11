# ARQUITETURA.md

Documento de decisões arquiteturais da API da Plataforma de Jogos — Trabalho 3 (GCET908).

---

## 1. Visão Geral

A aplicação segue uma **arquitetura em camadas** com o padrão **MVC** aplicado ao ambiente web. O objetivo é separar responsabilidades, reduzir acoplamento e permitir que cada parte do sistema evolua de forma independente.

**Regra fundamental:** nenhuma camada acessa outra pulando níveis. O controller não conhece o repositório; o service não conhece `req` nem `res`. Cada camada só conversa com a imediatamente abaixo.

---

## 2. Diagrama das Camadas

```mermaid
flowchart TD
    Cliente([Cliente HTTP])
    Routes[Routes - Definicao de URLs]
    Controllers[Controllers - Traducao HTTP / Dominio]
    Services[Services - Regras de Negocio]
    Repositories[Repositories - Acesso a Dados]
    Prisma[(Prisma ORM)]
    DB[(PostgreSQL)]
    Middleware[Middleware de Erros]

    Cliente -->|requisicao| Routes
    Routes --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Prisma
    Prisma --> DB
    DB -.resposta.-> Prisma
    Prisma -.resposta.-> Repositories
    Repositories -.resposta.-> Services
    Services -.resposta.-> Controllers
    Controllers -.resposta.-> Routes
    Routes -.resposta.-> Cliente

    Controllers -.erro.-> Middleware
    Services -.erro.-> Middleware
    Repositories -.erro.-> Middleware
    Middleware -.resposta de erro.-> Cliente
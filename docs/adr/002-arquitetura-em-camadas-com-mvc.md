# ADR 002 — Arquitetura em Camadas com MVC

## Status

Aceito

## Contexto

O Trabalho 3 exige reorganizar a API em camadas, com separacao clara de responsabilidades e preservacao do comportamento externo. A versao anterior tinha logica distribuida entre rotas e controllers, com acesso ao Prisma espalhado pelo codigo.

## Decisao

Adotar uma arquitetura em camadas com o padrao MVC aplicado ao ambiente web:

1. Routes - definicao de URLs
2. Controllers - traducao HTTP / dominio
3. Services - regras de negocio
4. Repositories - acesso a dados
5. Models/DTOs - contratos de entrada e saida
6. Middlewares - preocupacoes transversais

A regra fundamental: nenhuma camada acessa outra pulando niveis, e a camada de servico nao conhece req nem res.

Suporte: Factory (ServiceFactory.js), Injecao de Dependencia nos construtores, e erros customizados (AppError e subclasses).

## Consequencias

### Positivas

- Baixo acoplamento
- Testabilidade (services isolaveis)
- Manutenibilidade (responsabilidade unica)
- Preservacao de comportamento
- Reusabilidade

### Negativas

- Mais arquivos por endpoint
- Curva de aprendizado
- Risco de overengineering em projetos minusculos

### Mitigacoes

- Documentacao em ARQUITETURA.md
- Nomes descritivos (recurso + Camada .js)
- ADRs curtos em docs/adr/

## Comparacao com Trabalho 2

| Aspecto | Trabalho 2 | Trabalho 3 |
|---|---|---|
| Acesso ao Prisma | Espalhado | So em src/repositories/ |
| Regras de negocio | Nos controllers | Em src/services/ |
| Tratamento de erro | Repetido | Centralizado |
| Injecao de Dependencia | Nao havia | Via ServiceFactory |
| DTOs | Nao havia | 7 DTOs |

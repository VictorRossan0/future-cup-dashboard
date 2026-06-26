# Copa 2026 Intelligence

> A maior central de análise e previsões da Copa do Mundo FIFA 2026 baseada em Inteligência Artificial.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-v1-FF4154?logo=react)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)](https://supabase.com)

---

## Visão Geral

A **Copa 2026 Intelligence** é uma plataforma web completa para acompanhar, analisar e projetar resultados da Copa do Mundo FIFA 2026. O projeto combina dados oficiais da competição (48 seleções, 12 grupos, 104 jogos, 1.248 jogadores) com previsões geradas por múltiplos modelos de Inteligência Artificial, oferecendo um consenso inteligente entre provedores como ChatGPT, Gemini, Claude e outros.

A plataforma agora possui previsões por partida utilizando múltiplas Inteligências Artificiais, consenso automático por confronto, ranking histórico das IAs e Hall da Fama baseado em desempenho real durante a Copa do Mundo. O projeto compara as previsões das IAs com os resultados reais da competição, atualizando o ranking automaticamente após o encerramento de cada jogo.

A aplicação foi construída com foco em **performance**, **acessibilidade** e **experiência mobile**, utilizando uma arquitetura moderna de SSR/SSG com dados reativos e cache inteligente.

---

## Funcionalidades

### Experiência do Torcedor
- **Dashboard** — Visão geral da competição com contagem regressiva, estatísticas rápidas, próximos jogos e favoritos ao título baseados no consenso de IA.
- **Grupos** — Tabelas de classificação em tempo real com indicadores de classificação, saldo de gols e estatísticas de desempenho.
- **Jogos** — Calendário completo com filtros por grupo, data e status (agendado, ao vivo, encerrado).
- **Mata-mata** — Chaves eliminatórias da fase final com atualização dinâmica dos confrontos.
- **Seleções** — Ficha técnica de cada uma das 48 seleções com elenco completo, técnico, confederação e estatísticas do plantel.
- **Escalações** — Visualização tática em campo com formação, titulares, reservas, capitão e técnico.
- **Detalhes da Partida** — Página inspirada em Sofascore/Flashscore com abas de Resumo, Escalações e Análise de IA por jogo.

### Inteligência Artificial
- **Simulações de IA** — Cards comparativos por provedor com previsões de campeão, vice, semifinalistas, zebra, decepção, artilheiro e melhor jogador.
- **Consenso** — Ranking visual ampliado com pódio de favoritos, nível de concordância entre IAs e metodologia de cálculo.
- **Ranking das IAs** — Classificação dos modelos com badges de confiança e análise de performance histórica.
- **Análise por Partida** — Favoritismo, percentual de vitória e nível de consenso derivado das simulações cruzadas para cada confronto.
- **Previsões por Partida** — Cada partida pode possuir previsões independentes feitas por diferentes modelos de IA, gerando uma análise exclusiva por confronto.
- **Consenso por Partida** — Consolidação automática das previsões das IAs para cada jogo, exibindo o placar mais votado e o nível de concordância entre os modelos.
- **Avaliação Automática das IAs** — Após o encerramento do jogo, as previsões são avaliadas automaticamente e o ranking das IAs é atualizado em tempo real.
- **Hall da Fama das IAs** — Reconhecimento do desempenho real das Inteligências Artificiais ao longo da competição.

### Qualidade e Monitoramento
- **Painel de Qualidade de Dados** — Indicadores de cobertura (jogadores, jogos, seleções, estádios, fontes) com metas esperadas.
- **Indicador de Última Atualização** — Badge com coloração semântica (verde/amarelo/vermelho) baseada no tempo desde o último fetch.
- **Fallback Inteligente** — Se o Supabase estiver indisponível, a aplicação carrega mocks locais automaticamente sem quebrar a UI.
- A plataforma monitora automaticamente a sincronização dos resultados, a sincronização das escalações e a avaliação das previsões das IAs.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Framework | [TanStack Start v1](https://tanstack.com/start) (SSR/SSG, React 19) |
| UI | React 19 + TypeScript (strict) |
| Estilos | Tailwind CSS v4 + CSS custom properties (temas semânticos) |
| Componentes | Radix UI + shadcn/ui |
| Roteamento | TanStack Router (file-based, type-safe) |
| Estado / Cache | TanStack Query (React Query) |
| Banco de Dados | Supabase (PostgreSQL + Row Level Security) |
| Cliente DB | @supabase/supabase-js |
| Ícones | Lucide React |
| Build | Vite 7 |
| Lint | ESLint + Prettier |

### Backend Intelligence
- PostgreSQL Views
- PostgreSQL RPC
- Supabase Edge Functions
- pg_cron

---

## Arquitetura

```text
src/
├── routes/                 # Rotas file-based (TanStack Router)
│   ├── index.tsx           # Dashboard
│   ├── grupos.tsx          # Tabelas de grupos
│   ├── jogos.tsx           # Calendário de jogos
│   ├── mata-mata.tsx       # Fase eliminatória
│   ├── selecoes.*.tsx      # Lista e detalhe de seleções
│   ├── match.$id.tsx       # Detalhes da partida (Resumo / Escalações / IA)
│   ├── escalacoes.tsx      # Módulo de escalações oficiais
│   ├── simulacoes.tsx      # Simulações individuais por IA
│   ├── consenso.tsx        # Consenso cruzado entre IAs
│   ├── ranking-ias.tsx     # Ranking dos modelos
│   ├── regras.tsx          # Formato e regras da Copa 2026
│   ├── hall-da-fama.tsx    # Hall da Fama
│   ├── sobre.tsx           # Sobre o projeto
│   └── metodologia.tsx     # Metodologia de análise
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # shadcn/ui (Button, Card, Tabs, etc.)
│   ├── AppLayout.tsx       # Layout com sidebar e navegação mobile
│   ├── MatchCardView.tsx   # Card de jogo com bandeiras
│   ├── TeamFlag.tsx        # Componente de bandeira (Circle Flags CDN)
│   ├── MatchAIPanel.tsx    # Painel de IA na página de partida
│   ├── MatchLineupView.tsx # Visualização tática em campo
│   ├── DataQualityPanel.tsx# Monitoramento de dados
│   ├── LastUpdateBadge.tsx # Indicador de freshness
│   └── ...
├── services/
│   ├── copaService.ts      # Central de dados (Supabase views + fallback)
│   └── matchPredictionsService.ts # Busca previsões das IAs, consenso e calcula indicadores utilizados pelo frontend
├── hooks/
│   └── useCopa.ts          # Hooks TanStack Query para cada view
├── types/
│   └── views.ts            # Tipagens TypeScript das views do Supabase
├── integrations/
│   └── supabase/
│       └── client.ts       # Cliente Supabase com env vars
├── lib/
│   ├── flags.ts            # Mapeamento de códigos FIFA → bandeiras SVG
│   └── i18n.ts             # Traduções de status e labels
├── data/                   # Mocks locais (fallback offline)
├── styles.css              # Design tokens, tema dark e utilitários
└── router.tsx              # Configuração do TanStack Router
```

---

## Views do Banco de Dados (Supabase)

A aplicação consome exclusivamente **views públicas** do Supabase, garantindo segurança via RLS e separação entre dados brutos e dados apresentados:

| View | Propósito |
|------|-----------|
| `v_competition_dashboard` | Resumo da competição (datas, sedes, totais) |
| `v_groups_standings` | Classificação dos grupos com estatísticas |
| `v_matches_full` | Jogos completos (data, estádio, placar, status) |
| `v_teams_full` | Seleções com elenco, técnico e contadores por posição |
| `v_players_full` | Jogadores com time, posição, idade, clube e número |
| `v_rules_ordered` | Regras e regulamento ordenados por categoria |
| `v_ai_simulations_full` | Previsões completas por provedor de IA |
| `v_ai_simulation_consensus` | Consenso agregado entre todas as simulações |
| `v_ai_simulation_context` | Contexto de cada seleção para análise de IA |
| `v_data_quality_summary` | Métricas de cobertura e qualidade dos dados |
| `vw_match_lineups` | Cabeçalho das escalações (formação, técnico) |
| `match_lineup_players` | Jogadores titulares e reservas por partida |
| `vw_match_predictions_consensus` | Consolida automaticamente as previsões das IAs por partida. Responsável por: percentual de consenso, placar mais votado, vencedor mais votado e nível de consenso |
| `vw_ai_prediction_ranking` | Ranking estatístico das IAs. Inclui: partidas avaliadas, acertos de vencedor, acertos exatos, pontuação e posição geral |
| `vw_hall_of_fame` | View pública utilizada pela página Hall da Fama. Exibe apenas os indicadores finais do ranking |

---

## Automação

O projeto utiliza **Edge Functions**, **pg_cron**, **RPCs** e **Views Materializadas** (quando necessário) para manter os dados sempre atualizados.

Jobs atualmente existentes:

- **Atualização automática dos resultados** — Atualiza placares oficiais da Copa.
- **Sincronização das escalações** — Busca formações, titulares, reservas e técnicos.
- **Avaliação automática das previsões** — Após o encerramento das partidas, compara previsões das IAs com o resultado oficial. O processo ocorre totalmente de forma automática.

---

## Arquitetura da Inteligência Artificial

```text
IA Providers
(ChatGPT, Gemini, Claude...)

        │
        ▼

match_predictions

        │
        ▼

vw_match_predictions_consensus

        │
        ▼

evaluate_match_predictions()

        │
        ▼

vw_ai_prediction_ranking

        │
        ▼

vw_hall_of_fame

        │
        ▼

Frontend
```

Fluxo resumido: os provedores de IA geram previsões individuais por partida que são armazenadas em `match_predictions`. A view `vw_match_predictions_consensus` consolida essas previsões em indicadores de consenso. Após o encerramento da partida, a função `evaluate_match_predictions()` avalia cada previsão contra o resultado real, alimentando o ranking estatístico em `vw_ai_prediction_ranking`. Os indicadores finais são expostos pela `vw_hall_of_fame` para consumo do frontend.

---

## Como Executar Localmente

### Pré-requisitos
- [Bun](https://bun.sh) (recomendado) ou Node.js 20+
- Conta no [Supabase](https://supabase.com) com as views acima configuradas

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd copa-2026-intelligence
```

### 2. Configure as variáveis de ambiente

```bash
cp .env .env.local
```

Edite `.env.local` com suas credenciais do Supabase:

```env
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<sua-anon-key>
```

> **Nota:** O projeto utiliza a chave `anon` (pública) do Supabase. Dados sensíveis nunca trafegam pelo cliente.

### 3. Instale as dependências

```bash
bun install
```

### 4. Execute o servidor de desenvolvimento

```bash
bun run dev
```

A aplicação estará disponível em `http://localhost:8080`.

### 5. Build de produção

```bash
bun run build
```

---

## Design e UX

- **Tema Dark Esportivo:** paleta escura com verde gramado (`--primary`) e dourado campeão (`--gold`), projetada para longas sessões de leitura.
- **Mobile-First:** navegação via pills no mobile e sidebar colapsada no desktop. Testado em viewports a partir de 360px.
- **Responsividade:** tabelas se transformam em cards, grades se adaptam a 1-5 colunas e não há scroll horizontal em nenhuma rota.
- **Bandeiras:** carregadas sob demanda (lazy loading) do [Circle Flags](https://github.com/HatScripts/circle-flags) com fallback grácil para círculo com código FIFA.
- **SSR/SSG:** meta tags dinâmicas por rota (Open Graph, Twitter Cards) para compartilhamento otimizado.

---

## Roadmap

- [x] Dashboard com estatísticas e contagem regressiva
- [x] Grupos, jogos e mata-mata com dados reais do Supabase
- [x] Ficha técnica de seleções e elencos completos
- [x] Escalações oficiais com campo tático visual
- [x] Página de detalhes da partida (Sofascore-like)
- [x] Módulo de Simulações de IA por provedor
- [x] Consenso cruzado entre IAs com pódio visual
- [x] Ranking das IAs com badges de confiança
- [x] Painel de qualidade de dados em tempo real
- [x] Indicador de última atualização
- [x] Rebranding profissional e identidade visual
- [x] Responsividade completa (360px+)
- [x] Páginas institucionais (Sobre, Metodologia, Hall da Fama)
- [~] Hall da Fama das IAs (estrutura pronta, aguardando dados da competição)
- [~] Previsões por Partida (frontend habilitado, consolidação em andamento)
- [~] Avaliação Automática (pipeline configurado, aguardando início da Copa)
- [~] Consenso por Partida (view de consenso implementada, em validação)
- [ ] Integração com API de odds ao vivo
- [ ] Notificações push para gols e resultados
- [ ] Modo claro (light mode)
- [ ] Internacionalização (i18n) — EN/ES

---

## Licença

Este projeto é de código aberto sob a licença [MIT](LICENSE).

> **Aviso:** Os dados exibidos são simulados para fins de protótipo e análise. Não constituem informações oficiais da FIFA. A plataforma é um projeto independente de inteligência esportiva.

---

<p align="center">
  <strong>Copa 2026 Intelligence</strong> · Construído com React, TanStack Start e Supabase · 2025
</p>

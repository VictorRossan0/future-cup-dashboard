import type { Tiebreaker, TechnologyItem, TournamentPhase } from "@/types";

export const tiebreakers: Tiebreaker[] = [
  { title: "Pontos", description: "Maior número de pontos entre as seleções empatadas." },
  { title: "Saldo de gols", description: "Diferença entre gols pró e gols contra na fase." },
  { title: "Gols marcados", description: "Maior número de gols feitos em todos os jogos." },
  { title: "Confronto direto", description: "Resultado entre as seleções empatadas (pontos, saldo, gols)." },
  { title: "Fair Play", description: "Pontuação disciplinar baseada em cartões amarelos e vermelhos." },
  { title: "Sorteio FIFA", description: "Critério final, caso permaneça empate técnico." },
];

export const technology: TechnologyItem[] = [
  { title: "VAR", description: "Árbitro de vídeo para revisões em lances de pênalti, gol, expulsão e identificação errada." },
  { title: "Impedimento semiautomático", description: "Sistema com sensores na bola e câmeras para detectar impedimento em segundos." },
  { title: "Comunicação do árbitro", description: "Anúncios oficiais ao estádio explicando decisões do VAR." },
  { title: "Acréscimos rigorosos", description: "Tempo perdido com substituições, comemorações e atendimentos é recuperado integralmente." },
];

export const tournamentPhases: TournamentPhase[] = [
  { icon: "trophy", title: "Fase de Grupos", text: "12 grupos com 4 seleções. Cada equipe joga 3 partidas. Os 2 primeiros de cada grupo avançam." },
  { icon: "medal", title: "Melhores Terceiros", text: "Os 8 melhores colocados na terceira posição também avançam, totalizando 32 classificados." },
  { icon: "flame", title: "16 avos de Final", text: "Nova fase eliminatória do formato 2026: 32 seleções em mata-mata direto." },
  { icon: "target", title: "Oitavas → Final", text: "Após 16 avos: oitavas (16), quartas (8), semifinais (4) e final entre os 2 finalistas." },
];

export const bracketSummary =
  "Fase de Grupos → 16 avos (32) → Oitavas (16) → Quartas (8) → Semifinal (4) → Final (2). Total de 104 jogos.";

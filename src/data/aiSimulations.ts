import type { AISimulation, AIConsensus, AIName } from "@/types";

/**
 * Mock de simulações de IA.
 * Estrutura preparada para ser substituída por um JSON real
 * (ex.: /public/data/ai-simulations.json) sem alterações de UI.
 * Nenhuma chamada real a APIs de IA é executada.
 */
export const aiSimulations: AISimulation[] = [
  {
    id: "chatgpt-2026",
    ai: "ChatGPT",
    champion: "Argentina",
    runnerUp: "França",
    semifinalists: ["Argentina", "França", "Brasil", "Espanha"],
    topFive: ["Argentina", "França", "Brasil", "Espanha", "Inglaterra"],
    surprise: "Marrocos",
    disappointment: "Alemanha",
    topScorer: "Atacante fictício (ARG)",
    bestPlayer: "Camisa 10 fictício (ARG)",
    bestYoungPlayer: "Promessa fictícia (ESP)",
    groupOfDeath: "Grupo C",
    darkHorses: ["Marrocos", "Uruguai", "Japão"],
    riskFactors: [
      "Calendário apertado de viagens nos EUA, México e Canadá",
      "Desgaste de meio-campistas argentinos após temporada europeia",
      "Adaptação ao calor em sedes do sul dos EUA",
    ],
    rationale:
      "Argentina mantém o núcleo campeão de 2022, com substitutos talentosos surgindo e um meio-campo mais móvel. França é a sombra natural pela profundidade ofensiva.",
    confidence: 68,
  },
  {
    id: "claude-2026",
    ai: "Claude",
    champion: "França",
    runnerUp: "Brasil",
    semifinalists: ["França", "Brasil", "Argentina", "Portugal"],
    topFive: ["França", "Brasil", "Argentina", "Espanha", "Portugal"],
    surprise: "Japão",
    disappointment: "Bélgica",
    topScorer: "Atacante fictício (FRA)",
    bestPlayer: "Camisa 7 fictício (FRA)",
    bestYoungPlayer: "Promessa fictícia (BRA)",
    groupOfDeath: "Grupo F",
    darkHorses: ["Japão", "Senegal", "Colômbia"],
    riskFactors: [
      "Bélgica em transição geracional pode tropeçar cedo",
      "Pressão sobre a defesa brasileira em jogos de mata-mata",
      "Lesões acumuladas em atacantes franceses",
    ],
    rationale:
      "França combina renovação no meio com ataque versátil. Brasil chega em ascensão com mais equilíbrio defensivo. Japão se beneficia do formato com 16 avos.",
    confidence: 64,
  },
  {
    id: "gemini-2026",
    ai: "Gemini",
    champion: "Espanha",
    runnerUp: "Argentina",
    semifinalists: ["Espanha", "Argentina", "França", "Alemanha"],
    topFive: ["Espanha", "Argentina", "França", "Brasil", "Alemanha"],
    surprise: "Uruguai",
    disappointment: "Inglaterra",
    topScorer: "Atacante fictício (ESP)",
    bestPlayer: "Meia fictício (ESP)",
    bestYoungPlayer: "Promessa fictícia (FRA)",
    groupOfDeath: "Grupo D",
    darkHorses: ["Uruguai", "Croácia", "Países Baixos"],
    riskFactors: [
      "Inglaterra com histórico de oscilação em mata-mata",
      "Defesa espanhola pode sofrer contra contra-ataques rápidos",
      "Imprevisibilidade do Uruguai sob Bielsa",
    ],
    rationale:
      "Espanha vem de ciclo vencedor (Euro fictício) com posse refinada e jovens decisivos. Uruguai com Bielsa é a maior incógnita positiva do mata-mata.",
    confidence: 61,
  },
];

export const aiConsensus: AIConsensus = {
  mostCitedChampion: "Argentina / França (empate em citações)",
  mostCitedRunnerUp: "Argentina",
  commonFavorites: ["Argentina", "França", "Brasil", "Espanha"],
  mainDivergence:
    "A maior divergência é sobre o vice-campeão e o papel de Espanha: tratada como campeã pelo Gemini, mas fora do pódio em outras simulações.",
  overallSummary:
    "Há forte convergência sobre as 4 favoritas (Argentina, França, Brasil e Espanha). Marrocos, Japão e Uruguai aparecem como surpresas recorrentes, e o Grupo da Morte alterna entre C, D e F dependendo do modelo.",
};

export const aiAccentClasses: Record<AIName, string> = {
  ChatGPT: "from-primary/30 to-primary/5 border-primary/40",
  Claude: "from-gold/30 to-gold/5 border-gold/40",
  Gemini: "from-info/30 to-info/5 border-info/40",
};

export const aiDisclaimer =
  "Simulações geradas manualmente por IA com base nos dados disponíveis. Não representam previsão oficial.";

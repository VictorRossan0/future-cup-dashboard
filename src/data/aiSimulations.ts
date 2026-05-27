export interface AISimulation {
  id: string;
  ai: "ChatGPT" | "Claude" | "Gemini";
  champion: string;
  runnerUp: string;
  topScorer: string;
  surprise: string;
  disappointment: string;
  topFive: string[];
  rationale: string;
  confidence: number;
}

export const aiSimulations: AISimulation[] = [
  {
    id: "chatgpt-2026",
    ai: "ChatGPT",
    champion: "Argentina",
    runnerUp: "França",
    topScorer: "Atacante fictício (ARG)",
    surprise: "Marrocos",
    disappointment: "Alemanha",
    topFive: ["Argentina", "França", "Brasil", "Espanha", "Inglaterra"],
    rationale:
      "Argentina mantém o núcleo campeão de 2022, com substitutos talentosos surgindo e um meio-campo mais móvel. França é a sombra natural pela profundidade ofensiva.",
    confidence: 68,
  },
  {
    id: "claude-2026",
    ai: "Claude",
    champion: "França",
    runnerUp: "Brasil",
    topScorer: "Atacante fictício (FRA)",
    surprise: "Japão",
    disappointment: "Bélgica",
    topFive: ["França", "Brasil", "Argentina", "Espanha", "Portugal"],
    rationale:
      "França combina renovação no meio com ataque versátil. Brasil chega em ascensão com mais equilíbrio defensivo. Japão se beneficia do formato com 16 avos.",
    confidence: 64,
  },
  {
    id: "gemini-2026",
    ai: "Gemini",
    champion: "Espanha",
    runnerUp: "Argentina",
    topScorer: "Atacante fictício (ESP)",
    surprise: "Uruguai",
    disappointment: "Inglaterra",
    topFive: ["Espanha", "Argentina", "França", "Brasil", "Alemanha"],
    rationale:
      "Espanha vem de ciclo vencedor (Euro fictício) com posse refinada e jovens decisivos. Uruguai com Bielsa é a maior incógnita positiva do mata-mata.",
    confidence: 61,
  },
];

export const aiConsensus = {
  mostCitedChampion: "Argentina / França",
  mostCitedPlayer: "Atacante fictício (ARG)",
  toughestGroup: "Grupo C",
  potentialUnderdog: "Marrocos",
};

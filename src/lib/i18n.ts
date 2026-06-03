// Minimal i18n scaffold. Default pt-BR; future locales can be added.
export type Locale = "pt-BR" | "en" | "es" | "fr" | "ar" | "hi" | "zh" | "bn" | "ru" | "id";

export const defaultLocale: Locale = "pt-BR";
export const supportedLocales: Locale[] = [
  "pt-BR", "en", "es", "fr", "ar", "hi", "zh", "bn", "ru", "id",
];

// Position mapping ----------------------------------------------------------
const POSITION: Record<string, Partial<Record<Locale, string>>> = {
  goalkeeper:  { "pt-BR": "Goleiro", en: "Goalkeeper", es: "Portero" },
  defender:    { "pt-BR": "Defensor", en: "Defender", es: "Defensor" },
  midfielder:  { "pt-BR": "Meio-campista", en: "Midfielder", es: "Centrocampista" },
  forward:     { "pt-BR": "Atacante", en: "Forward", es: "Delantero" },
};

const STAGE: Record<string, Partial<Record<Locale, string>>> = {
  group_stage:   { "pt-BR": "Fase de Grupos", en: "Group Stage", es: "Fase de Grupos" },
  round_of_32:   { "pt-BR": "32 avos", en: "Round of 32", es: "Dieciseisavos" },
  round_of_16:   { "pt-BR": "Oitavas de final", en: "Round of 16", es: "Octavos de final" },
  quarter_final: { "pt-BR": "Quartas de final", en: "Quarter-finals", es: "Cuartos de final" },
  semi_final:    { "pt-BR": "Semifinais", en: "Semi-finals", es: "Semifinales" },
  third_place:   { "pt-BR": "Disputa de 3º lugar", en: "Third place", es: "Tercer puesto" },
  final:         { "pt-BR": "Final", en: "Final", es: "Final" },
};

const STATUS: Record<string, Partial<Record<Locale, string>>> = {
  scheduled: { "pt-BR": "Agendado", en: "Scheduled", es: "Programado" },
  confirmed: { "pt-BR": "Confirmado", en: "Confirmed", es: "Confirmado" },
  pending:   { "pt-BR": "Pendente", en: "Pending", es: "Pendiente" },
  current:   { "pt-BR": "Ao vivo", en: "Live", es: "En vivo" },
  finished:  { "pt-BR": "Encerrado", en: "Finished", es: "Finalizado" },
};

const RULE_CATEGORY: Record<string, Partial<Record<Locale, string>>> = {
  format:             { "pt-BR": "Formato" },
  group_stage:        { "pt-BR": "Fase de Grupos" },
  classification:     { "pt-BR": "Critérios de Classificação" },
  knockout:           { "pt-BR": "Mata-mata" },
  schedule:           { "pt-BR": "Calendário" },
  hosts:              { "pt-BR": "Países-sede" },
  arbitration:        { "pt-BR": "Arbitragem" },
  var:                { "pt-BR": "VAR" },
  anti_time_wasting:  { "pt-BR": "Anti cera" },
  medical:            { "pt-BR": "Protocolo médico" },
  disclaimer:         { "pt-BR": "Aviso" },
  needs_validation:   { "pt-BR": "A validar" },
};

const QUALIFICATION_STATUS: Record<string, Partial<Record<Locale, string>>> = {
  advanced:        { "pt-BR": "Classificado", en: "Advanced", es: "Clasificado" },
  qualified:       { "pt-BR": "Classificado", en: "Qualified", es: "Clasificado" },
  thirdContender:  { "pt-BR": "Possível melhor 3º", en: "Best 3rd contender" },
  best_third:      { "pt-BR": "Possível melhor 3º", en: "Best 3rd contender" },
  eliminated:      { "pt-BR": "Eliminado", en: "Eliminated", es: "Eliminado" },
  playing:         { "pt-BR": "Em disputa", en: "Playing", es: "En juego" },
};

function pick(dict: Record<string, Partial<Record<Locale, string>>>, key: string, locale: Locale): string {
  const entry = dict[key?.toLowerCase?.() ?? ""];
  if (!entry) return key;
  return entry[locale] ?? entry["pt-BR"] ?? key;
}

export const t = {
  position:   (k: string, l: Locale = defaultLocale) => pick(POSITION, k, l),
  stage:      (k: string, l: Locale = defaultLocale) => pick(STAGE, k, l),
  status:     (k: string, l: Locale = defaultLocale) => pick(STATUS, k, l),
  ruleCat:    (k: string, l: Locale = defaultLocale) => pick(RULE_CATEGORY, k, l),
  qualif:     (k: string, l: Locale = defaultLocale) => pick(QUALIFICATION_STATUS, k, l),
};

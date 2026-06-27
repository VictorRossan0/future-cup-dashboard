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
  scheduled:   { "pt-BR": "Agendado", en: "Scheduled", es: "Programado" },
  confirmed:   { "pt-BR": "Confirmado", en: "Confirmed", es: "Confirmado" },
  pending:     { "pt-BR": "Pendente", en: "Pending", es: "Pendiente" },
  current:     { "pt-BR": "Ao vivo", en: "Live", es: "En vivo" },
  in_progress: { "pt-BR": "Ao vivo", en: "Live", es: "En vivo" },
  finished:    { "pt-BR": "Encerrado", en: "Finished", es: "Finalizado" },
  completed:   { "pt-BR": "Encerrado", en: "Completed", es: "Finalizado" },
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

const AI_LABEL: Record<string, Partial<Record<Locale, string>>> = {
  page_title:            { "pt-BR": "Simulações com IA" },
  page_subtitle:         { "pt-BR": "Comparativo entre diferentes modelos de IA usando dados oficiais da Copa do Mundo FIFA 2026." },
  consensus:             { "pt-BR": "Consenso das IAs" },
  champion:              { "pt-BR": "Campeão previsto" },
  runner_up:             { "pt-BR": "Vice previsto" },
  top_scorer:            { "pt-BR": "Artilheiro previsto" },
  best_player:           { "pt-BR": "Melhor jogador" },
  best_young:            { "pt-BR": "Melhor jovem" },
  surprise:              { "pt-BR": "Seleção surpresa" },
  disappointment:        { "pt-BR": "Possível decepção" },
  group_of_death:        { "pt-BR": "Grupo da morte" },
  risk_factors:          { "pt-BR": "Fatores de risco" },
  tactical_notes:        { "pt-BR": "Notas táticas" },
  group_stage_pred:      { "pt-BR": "Previsão da fase de grupos" },
  validation_notes:      { "pt-BR": "Notas de validação" },
  confidence:            { "pt-BR": "Confiança" },
  show_details:          { "pt-BR": "Ver detalhes" },
  hide_details:          { "pt-BR": "Ocultar detalhes" },
  semifinalists:         { "pt-BR": "Semifinalistas" },
  top_favorites:         { "pt-BR": "Top favoritos" },
  dark_horses:           { "pt-BR": "Azarões" },
  most_voted_champion:   { "pt-BR": "Campeão mais previsto" },
  most_voted_runner_up:  { "pt-BR": "Vice mais previsto" },
  biggest_surprise:      { "pt-BR": "Maior surpresa" },
  biggest_disappointment:{ "pt-BR": "Maior decepção" },
  most_cited_god:        { "pt-BR": "Grupo da morte mais citado" },
  comparative_summary:   { "pt-BR": "Resumo comparativo" },
  favorites_by_ai:       { "pt-BR": "Favoritos por IA" },
  no_group_stage:        { "pt-BR": "Esta IA não retornou previsão detalhada da fase de grupos." },
  votes:                 { "pt-BR": "votos" },
  vote:                  { "pt-BR": "voto" },
  providers:             { "pt-BR": "Providers" },
  provider:              { "pt-BR": "Provider" },
  model:                 { "pt-BR": "Modelo" },
  ai:                    { "pt-BR": "IA" },
  summary:               { "pt-BR": "Resumo da análise" },
  simulations_analyzed:  { "pt-BR": "simulações analisadas" },
  avg_confidence:        { "pt-BR": "Confiança média" },
  first_place:           { "pt-BR": "1º colocado" },
  second_place:          { "pt-BR": "2º colocado" },
  third_place:           { "pt-BR": "Possível terceiro" },
  status:                { "pt-BR": "Status" },
  notes:                 { "pt-BR": "Notas" },
  corrected_fields:      { "pt-BR": "Campos corrigidos" },
  source:                { "pt-BR": "Fonte" },
  last_update:           { "pt-BR": "Última atualização" },
  chosen_by:             { "pt-BR": "Escolhida por" },
  cited_by:              { "pt-BR": "Citado por" },
  of_total:              { "pt-BR": "das simulações" },
  full_analysis:         { "pt-BR": "Ver análise completa" },
  hide_analysis:         { "pt-BR": "Ocultar análise" },
  validation_title:      { "pt-BR": "Notas de validação e curadoria" },
  validation_intro:      { "pt-BR": "Esta simulação passou por curadoria para corrigir inconsistências estruturais antes da importação." },
  data_from_supabase:    { "pt-BR": "Dados carregados do Supabase" },
  group_predictions:     { "pt-BR": "Previsões da fase de grupos" },
  comparative_by_ai:     { "pt-BR": "Comparativo por IA" },
  no_simulations:        { "pt-BR": "Sem simulações" },
  no_simulations_desc:   { "pt-BR": "Nenhuma simulação encontrada no Supabase." },
  justification:         { "pt-BR": "Justificativa" },
  group:                 { "pt-BR": "Grupo" },
  curated:               { "pt-BR": "Curadoria" },
};


export const t = {
  position:   (k: string, l: Locale = defaultLocale) => pick(POSITION, k, l),
  stage:      (k: string, l: Locale = defaultLocale) => pick(STAGE, k, l),
  status:     (k: string, l: Locale = defaultLocale) => pick(STATUS, k, l),
  ruleCat:    (k: string, l: Locale = defaultLocale) => pick(RULE_CATEGORY, k, l),
  qualif:     (k: string, l: Locale = defaultLocale) => pick(QUALIFICATION_STATUS, k, l),
  ai:         (k: string, l: Locale = defaultLocale) => pick(AI_LABEL, k, l),
};

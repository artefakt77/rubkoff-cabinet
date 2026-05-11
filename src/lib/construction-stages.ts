/** Восемь этапов строительства для отображения в кабинете */
export const CONSTRUCTION_STAGES = [
  { id: 1, title: "Подготовка участка" },
  { id: 2, title: "Фундамент" },
  { id: 3, title: "Коробка дома" },
  { id: 4, title: "Кровля" },
  { id: 5, title: "Инженерные сети" },
  { id: 6, title: "Отделка фасада" },
  { id: 7, title: "Внутренняя отделка" },
  { id: 8, title: "Сдача объекта" },
] as const;

export type ConstructionStageId = (typeof CONSTRUCTION_STAGES)[number]["id"];

export function getStageTitle(stageId: number): string {
  const stage = CONSTRUCTION_STAGES.find((s) => s.id === stageId);
  return stage?.title ?? "Этап не указан";
}

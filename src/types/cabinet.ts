/** Данные клиента для кабинета (совпадают с полями в Supabase после миграции) */
export type ClientProfile = {
  id: string;
  contract_number: string;
  full_name: string;
  object_address: string;
  current_stage: number;
  manager_name: string | null;
  manager_phone: string | null;
};

export type SitePhoto = {
  id: string;
  client_id: string;
  storage_path: string;
  taken_at: string;
};

/** Запись в таблице photos (публичный URL из Storage) */
export type PhotoRow = {
  id: string;
  client_id: string;
  url: string;
  caption: string | null;
  uploaded_at: string;
};

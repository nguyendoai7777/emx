export interface WithID {
  id: number;
}

export interface WithUUID {
  id: string;
}

export interface BaseRecord {
  id: number;
  updatedAt: string;
  createdAt: string;
}

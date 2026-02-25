import type { IDBPDatabase } from "idb";

export interface FormFieldRecord {
  field: string;
  value: any;
  createdAt: number;
  updatedAt: number;
}

export interface FormProgressRecord {
  formSlug: string;
  machineState: unknown;
  updatedAt: number;
}

export type NamesakeDB = IDBPDatabase<{
  formData: {
    key: string;
    value: FormFieldRecord;
  };
  formProgress: {
    key: string;
    value: FormProgressRecord;
  };
}>;

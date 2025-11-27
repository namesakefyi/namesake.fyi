import type { IDBPDatabase } from "idb";

export interface FormFieldRecord {
  field: string;
  value: any;
  createdAt: number;
  updatedAt: number;
}

export type NamesakeDB = IDBPDatabase<{
  formFields: {
    key: string;
    value: FormFieldRecord;
  };
}>;

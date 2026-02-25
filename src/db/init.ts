import { openDB } from "idb";
import type { FormFieldRecord, FormProgressRecord, NamesakeDB } from "./types";

const DB_NAME = "namesake";
const DB_VERSION = 2;
const FORM_DATA_STORE = "formData";
const FORM_PROGRESS_STORE = "formProgress";

let dbInstance: NamesakeDB | null = null;

export async function getDB(): Promise<NamesakeDB> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<{
    formData: {
      key: string;
      value: FormFieldRecord;
    };
    formProgress: {
      key: string;
      value: FormProgressRecord;
    };
  }>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore(FORM_DATA_STORE, { keyPath: "field" });
      }
      if (oldVersion < 2) {
        db.createObjectStore(FORM_PROGRESS_STORE, { keyPath: "formSlug" });
      }
    },
  });

  return dbInstance;
}

export { FORM_DATA_STORE, FORM_PROGRESS_STORE };

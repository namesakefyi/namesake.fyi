import { openDB } from "idb";
import type { FormFieldRecord, NamesakeDB } from "./types";

const DB_NAME = "namesake";
const DB_VERSION = 1;
const STORE_NAME = "formFields";

let dbInstance: NamesakeDB | null = null;

export async function getDB(): Promise<NamesakeDB> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<{
    formFields: {
      key: string;
      value: FormFieldRecord;
    };
  }>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the formFields object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "field" });
      }
    },
  });

  return dbInstance;
}

export { STORE_NAME };

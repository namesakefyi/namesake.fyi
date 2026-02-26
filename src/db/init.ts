import { openDB } from "idb";
import type { IDBPDatabase, IDBPTransaction } from "idb";
import type { FormFieldRecord, FormProgressRecord, NamesakeDB } from "./types";

export const DB_NAME = "namesake";
export const DB_VERSION = 2;
export const FORM_DATA_STORE = "formData";
export const FORM_PROGRESS_STORE = "formProgress";

type DBSchema = {
  formData: { key: string; value: FormFieldRecord };
  formProgress: { key: string; value: FormProgressRecord };
};

type Migration = (
  db: IDBPDatabase<DBSchema>,
  tx: IDBPTransaction<DBSchema, Array<keyof DBSchema>, "versionchange">,
) => void;

/**
 * Each entry at index i upgrades the DB from version i → i+1.
 * To add a new version: append a function here and increment DB_VERSION.
 * Guards with objectStoreNames.contains() make each step idempotent,
 * which prevents upgrade failures when stores already exist unexpectedly.
 */
export const migrations: Migration[] = [
  // v0 → v1: create formData store
  (db) => {
    if (!db.objectStoreNames.contains(FORM_DATA_STORE)) {
      db.createObjectStore(FORM_DATA_STORE, { keyPath: "field" });
    }
  },
  // v1 → v2: create formProgress store
  (db) => {
    if (!db.objectStoreNames.contains(FORM_PROGRESS_STORE)) {
      db.createObjectStore(FORM_PROGRESS_STORE, { keyPath: "formSlug" });
    }
  },
];

let dbInstance: NamesakeDB | null = null;

export async function getDB(): Promise<NamesakeDB> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<DBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        for (let v = oldVersion; v < (newVersion ?? DB_VERSION); v++) {
          migrations[v]?.(db, transaction);
        }
      },
      blocked(currentVersion, blockedVersion) {
        console.warn(
          `IndexedDB upgrade blocked (v${currentVersion} open elsewhere, needs v${blockedVersion})`,
        );
      },
      blocking(currentVersion, blockedVersion) {
        console.warn(
          `IndexedDB: closing to allow upgrade (v${currentVersion} → v${blockedVersion})`,
        );
        dbInstance?.close();
        dbInstance = null;
      },
    });
  } catch (error) {
    dbInstance = null;
    throw error;
  }

  return dbInstance;
}

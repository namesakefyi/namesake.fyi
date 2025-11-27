import { getDB, STORE_NAME } from "./init";
import type { FormFieldRecord } from "./types";

export async function saveField(field: string, value: any): Promise<void> {
  const db = await getDB();
  const existing = await db.get(STORE_NAME, field);
  const now = Date.now();

  await db.put(STORE_NAME, {
    field,
    value,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
}

export async function getField(field: string): Promise<any | undefined> {
  const db = await getDB();
  const record = await db.get(STORE_NAME, field);
  return record?.value;
}

export async function getFieldsByNames(
  fields: string[],
): Promise<FormFieldRecord[]> {
  const db = await getDB();
  const records: FormFieldRecord[] = [];

  for (const field of fields) {
    const record = await db.get(STORE_NAME, field);
    if (record) {
      records.push(record);
    }
  }

  return records;
}

export async function deleteField(field: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, field);
}

export async function clearAllFields(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

export async function getAllFields(): Promise<FormFieldRecord[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

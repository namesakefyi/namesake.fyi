import { beforeEach, describe, expect, it, vi } from "vitest";
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import {
  DB_NAME,
  DB_VERSION,
  FORM_DATA_STORE,
  FORM_PROGRESS_STORE,
  migrations,
} from "../init";

/**
 * Sets up the "namesake" IndexedDB at exactly `targetVersion` by running
 * only migrations[0..targetVersion-1] via the raw IDB API (not getDB()).
 * This simulates the state of a returning user's browser before an upgrade.
 */
async function createDBAtVersion(targetVersion: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, targetVersion);
    request.onupgradeneeded = (event) => {
      const req = event.target as IDBOpenDBRequest;
      const db = req.result;
      const tx = req.transaction;
      for (let v = 0; v < targetVersion; v++) {
        migrations[v]?.(db as any, tx as any);
      }
    };
    request.onsuccess = () => {
      request.result.close();
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Writes a record directly into a store using raw IDB, bypassing getDB().
 * Used to seed data into an old-version DB before triggering an upgrade.
 */
async function writeRawRecord(
  dbVersion: number,
  storeName: string,
  record: object,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, dbVersion);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).put(record);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
}

beforeEach(() => {
  global.indexedDB = new IDBFactory();
  vi.resetModules();
});

// ---------------------------------------------------------------------------
// CI invariant
// ---------------------------------------------------------------------------

describe("migration invariant", () => {
  it("migrations array has exactly DB_VERSION entries", () => {
    expect(migrations).toHaveLength(DB_VERSION);
  });
});

// ---------------------------------------------------------------------------
// Per-migration contract: schema correctness and idempotency
// ---------------------------------------------------------------------------

describe("per-migration contract", () => {
  const migrationDescriptions: Array<{
    label: string;
    expectedStores: string[];
  }> = [
    { label: "v0 → v1", expectedStores: [FORM_DATA_STORE] },
    { label: "v1 → v2", expectedStores: [FORM_PROGRESS_STORE] },
  ];

  migrationDescriptions.forEach(({ label, expectedStores }, index) => {
    describe(label, () => {
      it("creates the expected object stores", () => {
        // Apply only this one migration against a mock db shim
        const createdStores: string[] = [];
        const mockDb = {
          objectStoreNames: {
            contains: () => false,
          },
          createObjectStore: (name: string) => {
            createdStores.push(name);
          },
        };
        migrations[index]?.(mockDb as any, null as any);
        for (const store of expectedStores) {
          expect(createdStores).toContain(store);
        }
      });

      it("does not throw when stores already exist (idempotency)", () => {
        const mockDb = {
          objectStoreNames: {
            // Simulate all stores already present
            contains: () => true,
          },
          createObjectStore: () => {
            throw new Error("createObjectStore should not be called");
          },
        };
        expect(() =>
          migrations[index]?.(mockDb as any, null as any),
        ).not.toThrow();
      });
    });
  });
});

// ---------------------------------------------------------------------------
// Upgrade path tests
// ---------------------------------------------------------------------------

describe("upgrade paths", () => {
  it("fresh install (v0 → current): creates all stores", async () => {
    const { getDB } = await import("../init");
    const db = await getDB();
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
  });

  it("v1 → v2: adds formProgress without removing formData", async () => {
    await createDBAtVersion(1);
    const { getDB } = await import("../init");
    const db = await getDB();
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
  });

  it("v1 → v2 when formProgress already exists: upgrade succeeds (Safari iOS regression)", async () => {
    // Simulate an intermediate deployment that created formProgress at v1
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Both stores created at v1 (the broken intermediate state)
        db.createObjectStore(FORM_DATA_STORE, { keyPath: "field" });
        db.createObjectStore(FORM_PROGRESS_STORE, { keyPath: "formSlug" });
      };
      request.onsuccess = () => {
        request.result.close();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });

    const { getDB } = await import("../init");
    // Should not throw even though formProgress already exists
    await expect(getDB()).resolves.toBeDefined();
    const db = await getDB();
    expect(db.objectStoreNames.contains(FORM_DATA_STORE)).toBe(true);
    expect(db.objectStoreNames.contains(FORM_PROGRESS_STORE)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Data preservation
// ---------------------------------------------------------------------------

describe("data preservation", () => {
  it("existing formData records survive a v1 → v2 upgrade", async () => {
    await createDBAtVersion(1);
    await writeRawRecord(1, FORM_DATA_STORE, {
      field: "firstName",
      value: "Alice",
      createdAt: 1000,
      updatedAt: 1000,
    });

    const { getDB } = await import("../init");
    const db = await getDB();

    const record = await db.get(FORM_DATA_STORE, "firstName");
    expect(record?.value).toBe("Alice");
    expect(record?.createdAt).toBe(1000);
  });
});

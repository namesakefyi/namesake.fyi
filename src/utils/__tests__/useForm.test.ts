import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as database from "@/db/database";
import { useForm } from "../useForm";

vi.mock("@/db/database", () => ({
  getFieldsByNames: vi.fn(),
  saveField: vi.fn(),
}));

describe("useForm", () => {
  beforeEach(() => {
    vi.mocked(database.getFieldsByNames).mockResolvedValue([]);
    vi.mocked(database.saveField).mockResolvedValue(undefined);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe("initial state", () => {
    it("starts with isLoading true and isSubmitting false", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSubmitting).toBe(false);

      // Flush pending async effects to prevent act() warnings on teardown
      await act(async () => {});
    });

    it("exposes react-hook-form methods alongside custom properties", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      expect(result.current).toHaveProperty("register");
      expect(result.current).toHaveProperty("handleSubmit");
      expect(result.current).toHaveProperty("getValues");
      expect(result.current).toHaveProperty("setValue");
      expect(result.current).toHaveProperty("onSubmit");
      expect(result.current).toHaveProperty("isSubmitting");
      expect(result.current).toHaveProperty("isLoading");

      // Flush pending async effects to prevent act() warnings on teardown
      await act(async () => {});
    });
  });

  describe("loading saved data", () => {
    it("sets isLoading to false after loading completes", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("calls getFieldsByNames with the provided field names", async () => {
      const { result } = renderHook(() =>
        useForm(["oldFirstName", "oldLastName"]),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(database.getFieldsByNames).toHaveBeenCalledWith([
        "oldFirstName",
        "oldLastName",
      ]);
    });

    it("populates form values from saved IndexedDB records", async () => {
      vi.mocked(database.getFieldsByNames).mockResolvedValue([
        { field: "oldFirstName", value: "Jane", createdAt: 0, updatedAt: 0 },
        { field: "oldLastName", value: "Doe", createdAt: 0, updatedAt: 0 },
      ]);

      const { result } = renderHook(() =>
        useForm(["oldFirstName", "oldLastName"]),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.getValues("oldFirstName")).toBe("Jane");
      expect(result.current.getValues("oldLastName")).toBe("Doe");
    });

    it("sets isLoading to false even when getFieldsByNames throws", async () => {
      vi.mocked(database.getFieldsByNames).mockRejectedValue(
        new Error("DB unavailable"),
      );

      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

  });

  describe("auto-save on change", () => {
    it("saves a field when its value changes after loading", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        result.current.setValue("oldFirstName", "John");
      });

      await waitFor(() => {
        expect(database.saveField).toHaveBeenCalledWith("oldFirstName", "John");
      });
    });

    it("does not save when value is an empty string", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();

      await act(async () => {
        result.current.setValue("oldFirstName", "");
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(database.saveField).not.toHaveBeenCalled();
    });

    it("does not save when value is null", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();

      await act(async () => {
        result.current.setValue("oldFirstName", null);
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(database.saveField).not.toHaveBeenCalled();
    });

    it("logs an error when saveField throws during auto-save", async () => {
      vi.mocked(database.saveField).mockRejectedValue(new Error("Write failed"));

      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();
      vi.spyOn(console, "error").mockImplementation(() => {});

      await act(async () => {
        result.current.setValue("oldFirstName", "John");
      });

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith(
          "Error saving field oldFirstName:",
          expect.any(Error),
        );
      });
    });

    it("does not save when value is undefined", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      vi.clearAllMocks();

      await act(async () => {
        result.current.setValue("oldFirstName", undefined);
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(database.saveField).not.toHaveBeenCalled();
    });
  });

  describe("onSubmit", () => {
    it("saves all non-empty fields on submit", async () => {
      const { result } = renderHook(() =>
        useForm(["oldFirstName", "oldLastName"]),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        result.current.setValue("oldFirstName", "Jane");
        result.current.setValue("oldLastName", "Doe");
      });

      vi.clearAllMocks();

      await act(async () => {
        await result.current.onSubmit();
      });

      expect(database.saveField).toHaveBeenCalledWith("oldFirstName", "Jane");
      expect(database.saveField).toHaveBeenCalledWith("oldLastName", "Doe");
    });

    it("skips empty and nullish field values on submit", async () => {
      const { result } = renderHook(() =>
        useForm(["oldFirstName", "oldLastName"]),
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        result.current.setValue("oldFirstName", "Jane");
      });

      vi.clearAllMocks();

      await act(async () => {
        await result.current.onSubmit();
      });

      expect(database.saveField).toHaveBeenCalledWith("oldFirstName", "Jane");
      expect(database.saveField).not.toHaveBeenCalledWith(
        "oldLastName",
        expect.anything(),
      );
    });

    it("logs and re-throws when saveField throws during submit", async () => {
      vi.mocked(database.saveField).mockRejectedValue(new Error("Write failed"));

      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        result.current.setValue("oldFirstName", "Jane");
      });

      vi.clearAllMocks();
      vi.spyOn(console, "error").mockImplementation(() => {});

      await act(async () => {
        await expect(result.current.onSubmit()).rejects.toThrow("Write failed");
      });

      expect(console.error).toHaveBeenCalledWith(
        "Error saving form data:",
        expect.any(Error),
      );
      expect(result.current.isSubmitting).toBe(false);
    });

    it("sets isSubmitting to false after submission completes", async () => {
      const { result } = renderHook(() => useForm(["oldFirstName"]));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await act(async () => {
        result.current.setValue("oldFirstName", "Jane");
        await result.current.onSubmit();
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});

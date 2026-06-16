"use client";

import { create } from "zustand";
import { createContext, useContext } from "react";
import { WeddingData } from "./types";

interface StoreState {
  wedding: WeddingData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  mutate: (method: string, path: string, body?: unknown) => Promise<any>;
  setWedding: (w: WeddingData) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  wedding: null,
  loading: true,
  error: null,
  setWedding: (w) => set({ wedding: w, loading: false }),
  refresh: async () => {
    try {
      const r = await fetch("/api/wedding", { cache: "no-store" });
      if (r.ok) {
        const data = await r.json();
        set({ wedding: data, loading: false, error: null });
      } else {
        set({ loading: false });
      }
    } catch (e) {
      set({ loading: false, error: "Failed to load workspace" });
    }
  },
  mutate: async (method, path, body) => {
    const r = await fetch(path, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) {
      const msg = (await r.json().catch(() => ({}))).error || "Request failed";
      throw new Error(msg);
    }
    const data = await r.json().catch(() => null);
    await get().refresh();
    return data;
  },
}));

/**
 * Wedding data is provided via React context (seeded synchronously from server-loaded
 * data), so it is always available during SSR and client render. The Zustand store above
 * handles mutations + refresh; after a mutation the context value updates from the store.
 */
export const WeddingContext = createContext<WeddingData | null>(null);

export function useWedding(): WeddingData {
  const w = useContext(WeddingContext);
  if (!w) throw new Error("Wedding not loaded");
  return w;
}

"use client";

import { useEffect, useRef } from "react";
import { useStore, WeddingContext } from "@/lib/store";
import { WeddingData } from "@/lib/types";

export function WorkspaceProvider({
  initial,
  children,
}: {
  initial: WeddingData;
  children: React.ReactNode;
}) {
  // Seed the Zustand store (used for mutate/refresh) from server data.
  const inited = useRef(false);
  if (!inited.current) {
    useStore.setState({ wedding: initial, loading: false });
    inited.current = true;
  }
  // Keep store in sync when the server re-renders (e.g. after router.refresh()).
  useEffect(() => {
    useStore.setState({ wedding: initial, loading: false });
  }, [initial]);

  // Live wedding value: prefer store (reflects client mutations), fall back to server data.
  const storeWedding = useStore((s) => s.wedding);
  const value = storeWedding ?? initial;

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createFeedStore } from "./feed.store";
import type { FeedStore } from "./feed.types";

const FeedStoreContext = createContext<ReturnType<typeof createFeedStore> | null>(null);

export function FeedStoreProvider({ children, store: suppliedStore }: {
  children: ReactNode;
  store?: ReturnType<typeof createFeedStore>;
}) {
  // Capture once: tests can supply an isolated store without changing its lifetime.
  const [store] = useState(() => suppliedStore ?? createFeedStore());

  useEffect(() => {
    void store.getState().loadFeed();
  }, [store]);

  return <FeedStoreContext.Provider value={store}>{children}</FeedStoreContext.Provider>;
}

export function useFeedStore<T>(selector: (state: FeedStore) => T): T {
  const store = useContext(FeedStoreContext);
  if (!store) throw new Error("useFeedStore must be used within FeedStoreProvider");
  return useStore(store, selector);
}

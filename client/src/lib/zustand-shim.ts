// ─── Lightweight Zustand Shim ───
// Works as a standalone state manager when zustand is not installed
// When zustand is installed via npm, replace this import with 'zustand'

import { useState, useEffect, useMemo } from 'react';

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;
type GetState<T> = () => T;
type StoreCreator<T> = (set: SetState<T>, get: GetState<T>) => T;

const stores = new Map<string, { state: any; listeners: Set<() => void> }>();
let storeCounter = 0;

export function create<T extends object>(creator: StoreCreator<T>) {
  const storeId = `store_${storeCounter++}`;
  
  const getState: GetState<T> = () => {
    return stores.get(storeId)?.state as T;
  };

  const setState: SetState<T> = (partial) => {
    const store = stores.get(storeId);
    if (!store) return;
    
    const nextPartial = typeof partial === 'function' ? partial(store.state) : partial;
    store.state = { ...store.state, ...nextPartial };
    store.listeners.forEach(listener => listener());
  };

  const initialState = creator(setState, getState);
  stores.set(storeId, { state: initialState, listeners: new Set() });

  return function useStore<U = T>(selector?: (state: T) => U): U {
    const store = stores.get(storeId)!;
    const [, forceUpdate] = useState(0);

    useEffect(() => {
      const listener = () => forceUpdate(n => n + 1);
      store.listeners.add(listener);
      return () => { store.listeners.delete(listener); };
    }, [store]);

    if (selector) {
      return selector(store.state);
    }
    return store.state as unknown as U;
  };
}

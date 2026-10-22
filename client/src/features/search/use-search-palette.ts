import { useSyncExternalStore } from "react";

// Minimal global open/close store for the ⌘K command palette, so the sidebar
// search button and the topbar trigger both control the same dialog without
// dispatching synthetic keyboard events (which are unreliable across browsers).

let open = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const searchPalette = {
  open: () => {
    if (!open) {
      open = true;
      emit();
    }
  },
  close: () => {
    if (open) {
      open = false;
      emit();
    }
  },
  toggle: () => {
    open = !open;
    emit();
  },
  set: (value: boolean) => {
    if (open !== value) {
      open = value;
      emit();
    }
  },
  subscribe: (cb: () => void) => {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: () => open,
};

export function useSearchPaletteOpen(): boolean {
  return useSyncExternalStore(searchPalette.subscribe, searchPalette.get, () => false);
}

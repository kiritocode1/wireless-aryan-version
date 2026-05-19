import { useEffect } from "react";

type Options = {
  enabled?: boolean;
  preventDefault?: boolean;
  /** Allow the hotkey to fire even when focus is in an input/textarea. */
  allowInInput?: boolean;
};

function isEditable(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return false;
}

/**
 * Listen for a single keypress combination.
 * key: e.g. "k", "/", "n", "Escape". Use "mod" for Cmd on macOS or Ctrl elsewhere.
 * combo: ["mod", "k"] | ["k"]
 */
export function useHotkey(combo: string[], handler: (e: KeyboardEvent) => void, opts: Options = {}) {
  const { enabled = true, preventDefault = true, allowInInput = false } = opts;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const wantMod = combo.includes("mod");
      const wantShift = combo.includes("shift");
      const key = combo.find((c) => c !== "mod" && c !== "shift");
      if (!key) return;

      const hasMod = e.metaKey || e.ctrlKey;
      if (wantMod && !hasMod) return;
      if (!wantMod && hasMod) return;
      if (wantShift !== e.shiftKey) return;
      if (e.key.toLowerCase() !== key.toLowerCase()) return;

      if (!allowInInput && isEditable(e.target)) return;

      if (preventDefault) e.preventDefault();
      handler(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [combo, handler, enabled, preventDefault, allowInInput]);
}

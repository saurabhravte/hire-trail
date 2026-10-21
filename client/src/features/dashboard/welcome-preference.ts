const KEY = "hiretrail:show-welcome";
export const WELCOME_PREF_EVENT = "hiretrail:welcome-pref";

export function getShowWelcome(): boolean {
  try {
    return localStorage.getItem(KEY) !== "false";
  } catch {
    return true;
  }
}

export function setShowWelcome(value: boolean): void {
  try {
    localStorage.setItem(KEY, String(value));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(WELCOME_PREF_EVENT, { detail: value }));
}
import type {
  GeneratedModelData,
  GenerationParams,
  PipelineStep,
  PrintabilityReport,
} from "@/types";

const STORAGE_KEY = "forgeform_guest_session";

export interface GuestSession {
  formValues: GenerationParams;
  model: GeneratedModelData;
  printability: PrintabilityReport;
  pipeline: PipelineStep[];
  savedAt: string;
}

export function saveGuestSession(session: Omit<GuestSession, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    const payload: GuestSession = { ...session, savedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full or unavailable
  }
}

export function loadGuestSession(): GuestSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestSession;
  } catch {
    return null;
  }
}

export function clearGuestSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasGuestSession(): boolean {
  return loadGuestSession() !== null;
}

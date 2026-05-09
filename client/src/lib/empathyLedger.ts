/**
 * Client-side helpers for talking to the Empathy Ledger admin UI.
 *
 * The base URL is configurable via VITE_EMPATHY_LEDGER_URL — defaults to the
 * local dev server (http://localhost:3030). Set to https://www.empathyledger.com
 * (or the prod URL) in .env when deploying.
 */

const DEFAULT_BASE = "http://localhost:3030";

/** A Curious Tractor — the org all Harvest photos sit under in EL. */
export const EL_HARVEST_ORG_ID = "db0de7bd-eb10-446b-99e9-0f3b7c199b8a";

export function getElBase(): string {
  const v = import.meta.env.VITE_EMPATHY_LEDGER_URL as string | undefined;
  return (v || DEFAULT_BASE).replace(/\/$/, "");
}

/** Direct links into the EL admin surfaces we send Harvest admins to. */
export const elLinks = {
  photoManager: () => `${getElBase()}/organisations/${EL_HARVEST_ORG_ID}/photo-manager`,
  galleries:    () => `${getElBase()}/admin/galleries`,
  bulkEdit:     () => `${getElBase()}/admin/bulk-edit`,
  articles:     () => `${getElBase()}/admin/stories?contentType=articles`,
  /** A specific article — pass the EL article id (uuid). */
  articleById: (id: string) => `${getElBase()}/admin/stories/${id}`,
};

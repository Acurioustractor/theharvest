export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const getLoginUrl = (redirectTo?: string) => {
  if (typeof window === "undefined") return "/login";
  const target =
    redirectTo ?? `${window.location.pathname}${window.location.search}`;
  const params = new URLSearchParams({ redirect: target });
  return `/login?${params.toString()}`;
};

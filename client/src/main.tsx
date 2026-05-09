import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { trpc } from "./lib/trpc";
import "./index.css";

/**
 * Read dev-admin flag at request time. Server accepts the x-dev-admin header
 * only on localhost + non-production. Client sends it whenever the user has
 * enabled dev mode via /something?devAdmin=1 (which sets localStorage).
 */
function devAdminHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  if (window.location.hostname !== "localhost") return {};
  if (localStorage.getItem("dev-admin-login") !== "true") return {};
  return { "x-dev-admin": "true" };
}

function Root() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          headers: () => devAdminHeaders(),
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);

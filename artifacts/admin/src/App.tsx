import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import Dashboard from "@/pages/Dashboard";
import Registrations from "@/pages/Registrations";
import Contacts from "@/pages/Contacts";
import NumerologySessions from "@/pages/NumerologySessions";
import SocialMedia from "@/pages/SocialMedia";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { checkAuth } from "@/lib/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function Router({ onLogout }: { onLogout: () => void }) {
  return (
    <Layout onLogout={onLogout}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/registrations" component={Registrations} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/numerology" component={NumerologySessions} />
        <Route path="/social" component={SocialMedia} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    checkAuth().then(ok => setAuthState(ok ? "authenticated" : "unauthenticated"));
  }, []);

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">載入中…</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          {authState === "unauthenticated" ? (
            <Login onSuccess={() => setAuthState("authenticated")} />
          ) : (
            <Router onLogout={() => setAuthState("unauthenticated")} />
          )}
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

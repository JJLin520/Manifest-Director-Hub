import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Nav from "@/components/Nav";
import BrandHome from "@/pages/BrandHome";
import CoursePage from "@/pages/Home";
import ServicesPage from "@/pages/ServicesPage";
import EventsPage from "@/pages/EventsPage";
import AboutPage from "@/pages/AboutPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Nav />
      <Switch>
        <Route path="/" component={BrandHome} />
        <Route path="/course" component={CoursePage} />
        <Route path="/services" component={ServicesPage} />
        <Route path="/events" component={EventsPage} />
        <Route path="/about" component={AboutPage} />
        <Route component={BrandHome} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

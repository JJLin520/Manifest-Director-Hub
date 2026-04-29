import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CoursePage from "@/pages/Home";
import BrandHome from "@/pages/BrandHome";
import ServicesPage from "@/pages/ServicesPage";
import EventsPage from "@/pages/EventsPage";
import AboutPage from "@/pages/AboutPage";
import NumerologyPage from "@/pages/NumerologyPage";
import NumerologyEventPage from "@/pages/NumerologyEventPage";
import FasciaPage from "@/pages/FasciaPage";
import BlogPage from "@/pages/BlogPage";
import ArticlePage from "@/pages/ArticlePage";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Nav />
      <div className="pb-16 md:pb-0">
        <Switch>
          <Route path="/" component={BrandHome} />
          <Route path="/course" component={CoursePage} />
          <Route path="/numerology" component={NumerologyPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/lecture" component={NumerologyEventPage} />
          <Route path="/fascia" component={FasciaPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/blog/:slug" component={ArticlePage} />
          <Route path="/blog" component={BlogPage} />
          <Route component={BrandHome} />
        </Switch>
        <Footer />
      </div>
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

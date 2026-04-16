import { Router as WouterRouter, Switch, Route } from "wouter";
import EventPage from "@/pages/EventPage";

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={EventPage} />
        <Route component={EventPage} />
      </Switch>
    </WouterRouter>
  );
}

export default App;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HealthMonitor from "./pages/HealthMonitor";
import CompanionMode from "./pages/CompanionMode";
import Emergency from "./pages/Emergency";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Journal from "./pages/Journal";
import Meditation from "./pages/Meditation";
import Goals from "./pages/Goals";
import Discover from "./pages/Discover";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Support from "./pages/Support";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* PRIMARY: Health Monitoring */}
      <Route path="/health" component={HealthMonitor} />
      <Route path="/companion" component={CompanionMode} />
      <Route path="/emergency" component={Emergency} />
      {/* SECONDARY: Wellness Toolkit */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/habits" component={Habits} />
      <Route path="/journal" component={Journal} />
      <Route path="/meditation" component={Meditation} />
      <Route path="/goals" component={Goals} />
      <Route path="/discover" component={Discover} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/support" component={Support} />
      <Route path="/settings" component={Settings} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

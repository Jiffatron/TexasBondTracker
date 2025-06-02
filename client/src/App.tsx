import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import BondTracker from "@/pages/BondTracker";
import SchoolDistricts from "@/pages/SchoolDistricts";
import CitiesCounties from "@/pages/CitiesCounties";
import AuditParser from "@/pages/AuditParser";
import ISDExplorer from "@/pages/ISDExplorer";
import TopTaxpayers from "@/pages/TopTaxpayers";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/bonds" component={BondTracker} />
      <Route path="/isds" component={SchoolDistricts} />
      <Route path="/cities" component={CitiesCounties} />
      <Route path="/audit-parser" component={AuditParser} />
      <Route path="/isd-explorer" component={ISDExplorer} />
      <Route path="/top-taxpayers" component={TopTaxpayers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

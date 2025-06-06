// client/src/App.tsx
import { Router, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

import { queryClient } from "@/lib/queryClient";

// Pages
import Dashboard from "@/pages/Dashboard";
import BondTracker from "@/pages/BondTracker";
import SchoolDistricts from "@/pages/SchoolDistricts";
import CitiesCounties from "@/pages/CitiesCounties";
import AuditParser from "@/pages/AuditParser";
import ISDExplorer from "@/pages/ISDExplorer";
import TopTaxpayers from "@/pages/TopTaxpayers";
import NotFound from "@/pages/not-found";

// Dynamically use Vite's base path
const base = import.meta.env.BASE_URL;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router base={base}>
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
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

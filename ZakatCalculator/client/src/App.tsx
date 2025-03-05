import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Calculator from "@/pages/Calculator";
import Terminology from "@/pages/Terminology";
import BottomNav from "@/components/BottomNav";
import NotFound from "@/pages/not-found";
import { ErrorBoundary } from "@/components/ErrorBoundary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Calculator} />
      <Route path="/terminology" component={Terminology} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-white font-[Times New Roman]">
          <main className="container mx-auto px-4 pb-20">
            <Router />
          </main>
          <BottomNav />
        </div>
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import PublicFeed from "./pages/PublicFeed";
import EventDetail from "./pages/EventDetail";
import Auth from "./pages/Auth";
const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;
  return authed ? children : <Navigate to="/auth" replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
            <Route path="/feed" element={<PublicFeed />} />
            <Route path="/event/:id" element={<EventDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

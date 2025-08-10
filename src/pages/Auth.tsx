import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Auth: React.FC = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) nav("/", { replace: true });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) nav("/", { replace: true });
    });
    return () => subscription.unsubscribe();
  }, [nav]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    if (!email || !password) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "Confirm your email to finish signup." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Signed in", description: "Welcome back!" });
        nav("/", { replace: true });
      }
    } catch (err: any) {
      toast({ title: "Authentication error", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectUrl } });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: "Google sign-in failed", description: err?.message || "Please try again.", variant: "destructive" });
    }
  }

  return (
    <main className="container py-10">
      <Helmet>
        <title>{mode === "signin" ? "Sign in" : "Sign up"} – Vibe Countdown</title>
        <meta name="description" content="Sign in or create an account to save and share your events." />
        <link rel="canonical" href="/auth" />
      </Helmet>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{mode === "signin" ? "Welcome back" : "Create your account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
              </Button>
            </form>
            <div className="mt-4">
              <Button variant="secondary" className="w-full" onClick={signInWithGoogle}>
                Continue with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <button className="story-link" onClick={() => setMode("signup")}>No account? Sign up</button>
              ) : (
                <button className="story-link" onClick={() => setMode("signin")}>Already have an account? Sign in</button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Auth;

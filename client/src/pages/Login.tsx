import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Github, Mail, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") return "/";
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || "/";
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setLocation(redirectTo);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLocation(redirectTo);
      }
    });
    return () => subscription.unsubscribe();
  }, [redirectTo, setLocation]);

  const handlePasswordSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      toast.error("Sign in failed", { description: error.message });
      return;
    }
    toast.success("Signed in successfully");
    setLocation(redirectTo);
  };

  const handlePasswordSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Sign up failed", { description: error.message });
      return;
    }
    toast.success("Check your inbox to confirm your email.");
  };

  const handleMagicLink = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/login?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error("Magic link failed", { description: error.message });
      return;
    }
    toast.success("Magic link sent. Check your email.");
  };

  const handleOAuth = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/login?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) {
      toast.error("OAuth sign-in failed", { description: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-stone-50 flex items-center justify-center px-4 py-24">
      <Card className="w-full max-w-lg shadow-xl border-stone-200">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-serif text-stone-800">
            Sign in to The Harvest
          </CardTitle>
          <CardDescription>
            Use any sign-in method. You can create an account with email too.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleOAuth("google")}
            >
              <Sparkles className="h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => handleOAuth("github")}
            >
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-stone-200" />
            or
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="password">Email + Password</TabsTrigger>
              <TabsTrigger value="magic">Magic Link</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Button
                  className="gap-2"
                  disabled={loading || !email || !password}
                  onClick={handlePasswordSignIn}
                >
                  <Lock className="h-4 w-4" />
                  Sign in
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={loading || !email || !password}
                  onClick={handlePasswordSignUp}
                >
                  <Mail className="h-4 w-4" />
                  Create account
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="magic" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={magicEmail}
                  onChange={event => setMagicEmail(event.target.value)}
                />
              </div>
              <Button
                className="w-full gap-2"
                disabled={loading || !magicEmail}
                onClick={handleMagicLink}
              >
                <Mail className="h-4 w-4" />
                Send magic link
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

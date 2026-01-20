import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, Copy, Check } from "lucide-react";

export default function Account() {
  const { user, loading, isAuthenticated, logout, refresh } = useAuth();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const promoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/trpc/admin.promoteToAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { openId: user?.openId } }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Failed to promote");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("You are now an admin!", {
        description: "Refresh the page to see admin features.",
      });
      queryClient.invalidateQueries({ queryKey: ["app-user"] });
      refresh();
    },
    onError: (error: Error) => {
      toast.error("Promotion failed", {
        description: error.message,
      });
    },
  });

  const copyOpenId = () => {
    if (user?.openId) {
      navigator.clipboard.writeText(user.openId);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading account…</div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl text-stone-800">
                Sign in required
              </CardTitle>
              <CardDescription>
                Please sign in to view your account details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center py-12">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl text-stone-800">
              Account
            </CardTitle>
            <CardDescription>Manage your session and profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Info */}
            <div className="rounded-lg border p-4 space-y-2">
              <div className="text-sm text-muted-foreground">Signed in as</div>
              <div className="text-lg font-medium">
                {user?.name || user?.email || "User"}
              </div>
              {user?.email && (
                <div className="text-sm text-muted-foreground">{user.email}</div>
              )}
              {user?.role && (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs uppercase tracking-wide font-medium mt-2">
                  <Shield className="h-3 w-3" />
                  {user.role}
                </div>
              )}
            </div>

            {/* User ID (for admin setup) */}
            {user?.openId && (
              <div className="rounded-lg border border-dashed p-4 bg-stone-50">
                <div className="text-xs text-muted-foreground mb-1">Your User ID</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white px-2 py-1 rounded border font-mono truncate">
                    {user.openId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyOpenId}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Add this to <code className="bg-white px-1 rounded">OWNER_OPEN_ID</code> in your .env file to auto-promote to admin.
                </p>
              </div>
            )}

            {/* Admin Promotion */}
            {user?.role !== "admin" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-stone-800 text-sm">
                      Become an Admin
                    </div>
                    <p className="text-xs text-stone-600 mt-1 mb-3">
                      Admin access lets you edit images on the website, manage events, and more.
                    </p>
                    <Button
                      size="sm"
                      className="bg-amber-500 hover:bg-amber-600 text-black"
                      onClick={() => promoteMutation.mutate()}
                      disabled={promoteMutation.isPending}
                    >
                      {promoteMutation.isPending ? "Promoting..." : "Make me an Admin"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Features */}
            {user?.role === "admin" && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-stone-800 text-sm">
                      Admin Access Active
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      You can now click on images throughout the site to change them.
                      Hover over any image to see the edit button.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={logout}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

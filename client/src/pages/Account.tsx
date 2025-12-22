import Layout from "@/components/Layout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";

export default function Account() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading account…</div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl text-[#2c4c3b]">
                Sign in required
              </CardTitle>
              <CardDescription>
                Please sign in to view your account details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-[#2c4c3b] hover:bg-[#1a3326]"
                onClick={() => (window.location.href = getLoginUrl())}
              >
                Sign in
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl text-[#2c4c3b]">
              Account
            </CardTitle>
            <CardDescription>Manage your session and profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Signed in as</div>
              <div className="text-lg font-medium">
                {user?.name || user?.email || "User"}
              </div>
              {user?.email ? (
                <div className="text-sm text-muted-foreground">{user.email}</div>
              ) : null}
              {user?.role ? (
                <div className="text-xs uppercase tracking-wide text-muted-foreground mt-2">
                  Role: {user.role}
                </div>
              ) : null}
            </div>
            <Button variant="outline" className="w-full" onClick={logout}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

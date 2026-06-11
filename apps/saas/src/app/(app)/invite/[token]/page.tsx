"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [status, setStatus] = useState<"loading" | "accepting" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");

  useEffect(() => {
    acceptInvite();
  }, []);

  async function acceptInvite() {
    setStatus("accepting");

    const res = await fetch("/api/invitations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      const err = await res.json();
      setErrorMessage(err.error || "Failed to accept invitation");
      setStatus("error");
      return;
    }

    const data = await res.json();
    setWorkspaceSlug(data.workspace_slug);
    setStatus("success");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Bug className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Workspace Invitation</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {(status === "loading" || status === "accepting") && (
            <>
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <CardDescription>Accepting your invitation...</CardDescription>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
              <CardDescription>You&apos;ve been added to the workspace!</CardDescription>
              <Button onClick={() => router.push(`/${workspaceSlug}`)}>
                Go to Workspace
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-8 w-8 mx-auto text-destructive" />
              <CardDescription className="text-destructive">{errorMessage}</CardDescription>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

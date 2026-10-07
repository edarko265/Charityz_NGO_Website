import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FunctionsHttpError } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Status = "idle" | "working" | "done" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>(email && token ? "idle" : "error");
  const [message, setMessage] = useState(email && token ? "" : "This unsubscribe link is incomplete. Please use the link from your email.");

  // Requires a click, so link scanners that open emails can't unsubscribe people by accident
  const unsubscribe = async () => {
    setStatus("working");
    const { error } = await supabase.functions.invoke("newsletter-unsubscribe", { body: { email, token } });
    if (error) {
      const body = error instanceof FunctionsHttpError ? await error.context.json().catch(() => null) : null;
      setMessage(body?.error || "Something went wrong. Please try again or email info@charityz.org.");
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-20">
        <Card className="max-w-lg mx-auto shadow-card">
          <CardHeader>
            <CardTitle>Newsletter subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "done" ? (
              <>
                <p>{email} has been unsubscribed. You won't receive any more newsletters from Charity Z.</p>
                <p className="text-sm text-muted-foreground">Changed your mind? You can sign up again any time at the bottom of our home page.</p>
                <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
              </>
            ) : status === "error" ? (
              <p className="text-destructive">{message}</p>
            ) : (
              <>
                <p>Stop sending the Charity Z newsletter to <strong>{email}</strong>?</p>
                <Button onClick={unsubscribe} disabled={status === "working"}>
                  {status === "working" ? "Unsubscribing..." : "Unsubscribe"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Eyebrow } from "@/components/ui";

export function Auth({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const nav = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-24 px-6">
      <Eyebrow>{mode === "login" ? "Sign in" : "Create your rubric"}</Eyebrow>
      <h1 className="serif text-display-l text-ink-primary mt-2 mb-2 leading-[1.02]">
        {mode === "login" ? "Welcome back." : "Start with honesty."}
      </h1>
      <p className="text-body-l text-ink-tertiary mb-10">
        {mode === "login"
          ? "Your rubric is waiting."
          : "It takes about two evenings to build. Free forever at this tier."}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Both signup and login route into /app — the AppShell decides
          // whether you're on step 1 (rent-or-buy) or already in the Queue.
          nav("/app");
        }}
        className="space-y-4"
      >
        {mode === "signup" && (
          <div>
            <label className="block eyebrow mb-2">Your first name</label>
            <Input
              placeholder="Jack"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="block eyebrow mb-2">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full !py-3">
          {mode === "login" ? "Sign in" : "Get started"}
        </Button>
      </form>
      <p className="text-body-s text-ink-tertiary mt-8 text-center">
        {mode === "login" ? (
          <>
            Don't have an account? <Link to="/signup" className="btn-link">Sign up</Link>
          </>
        ) : (
          <>
            Already have one? <Link to="/login" className="btn-link">Sign in</Link>
          </>
        )}
      </p>
    </div>
  );
}

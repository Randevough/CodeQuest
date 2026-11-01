"use client";
import { authenticate } from "@/actions/auth";
import { useActionState, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";

const subscribe = (notify: () => void) => {
    window.addEventListener("popstate", notify);
    return () => window.removeEventListener("popstate", notify);
};

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const [values, setValues] = useState({ email: "", password: "" });
    const query = useSyncExternalStore(subscribe, () => window.location.search, () => "");
    const params = new URLSearchParams(query);
    const notice = params.get("signedUp") ? "Account created. Check your email to verify your account before signing in." : params.get("verified") ? "Email verified. You can now sign in." : "";
    useEffect(() => { if (errorMessage) toast.error(errorMessage); }, [errorMessage]);
    return <>
        <h1 className="mb-3">Welcome back</h1>
        <p className="mb-8 text-muted">Sign in to manage your quests and submissions</p>
        {notice && <p role="status" className="mb-6 rounded-input border border-border bg-surface-raised p-4 text-success">{notice}</p>}
        <form action={dispatch} className="flex flex-col gap-5" aria-describedby={errorMessage ? "auth-error" : undefined}>
                <div><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="example@cyber-univ.ac.id" value={values.email} onChange={event => setValues({ ...values, email: event.target.value })} /></div>
                <div><label htmlFor="password">Password</label><PasswordInput id="password" name="password" required minLength={6} maxLength={128} autoComplete="current-password" value={values.password} onChange={event => setValues({ ...values, password: event.target.value })} /></div>
            {errorMessage && <p id="auth-error" role="alert" className="rounded-input border border-danger bg-surface p-4 text-danger">{errorMessage}</p>}
            <SubmitButton loadingText="Signing in...">Sign in</SubmitButton>
        </form>
        <p className="mt-8 text-muted">Don&apos;t have an account? <Link href="/signup" className="inline-flex min-h-11 items-center font-semibold text-foreground underline">Sign up</Link></p>
    </>;
}

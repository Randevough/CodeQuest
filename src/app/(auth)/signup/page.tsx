"use client";
import { signup } from "@/actions/auth";
import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { toast } from "sonner";

export default function SignupPage() {
    const [errorMessage, dispatch] = useActionState(signup, undefined);
    const [values, setValues] = useState({ email: "", password: "", name: "", confirmPassword: "" });
    useEffect(() => { if (errorMessage) toast.error(errorMessage); }, [errorMessage]);
    return <>
        <h1 className="mb-3">Create an account</h1>
        <p className="mb-8 text-muted">Use your @cyber-univ.ac.id email to register.</p>
        <form action={dispatch} className="flex flex-col gap-5" aria-describedby={errorMessage ? "auth-error" : undefined}>
                <div><label htmlFor="name">Nickname</label><input id="name" name="name" type="text" autoComplete="nickname" maxLength={50} value={values.name} onChange={event => setValues({ ...values, name: event.target.value })} /></div>
                <div><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="example@cyber-univ.ac.id" value={values.email} onChange={event => setValues({ ...values, email: event.target.value })} /></div>
                <div><label htmlFor="password">Password</label><PasswordInput id="password" name="password" required minLength={6} maxLength={128} autoComplete="new-password" value={values.password} onChange={event => setValues({ ...values, password: event.target.value })} /></div>
                <div><label htmlFor="confirmPassword">Confirm password</label><PasswordInput id="confirmPassword" name="confirmPassword" required minLength={6} maxLength={128} autoComplete="new-password" value={values.confirmPassword} onChange={event => setValues({ ...values, confirmPassword: event.target.value })} /></div>
            {errorMessage && <p id="auth-error" role="alert" className="rounded-input border border-danger bg-surface p-4 text-danger">{errorMessage}</p>}
            <SubmitButton loadingText="Creating account...">Create account</SubmitButton>
        </form>
        <p className="mt-8 text-muted">Already have an account? <Link href="/login" className="inline-flex min-h-11 items-center font-semibold text-foreground underline">Sign in</Link></p>
    </>;
}

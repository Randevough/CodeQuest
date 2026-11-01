"use client";
import { useFormStatus } from "react-dom";
export function SubmitButton({ children, className = "", loadingText = "Submitting..." }: { children: React.ReactNode; className?: string; loadingText?: string }) {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} aria-busy={pending} className={`button-primary w-full ${className}`}>{pending ? loadingText : children}</button>;
}

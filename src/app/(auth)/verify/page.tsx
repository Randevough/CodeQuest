import { Suspense } from "react";
import { VerifyForm } from "./VerifyForm";
export const metadata = { title: "Verify Email - CodeQuest", description: "Verify your CodeQuest email address" };
export default function VerifyPage() {
    return <><h1 className="mb-3">Verify your email</h1><p className="mb-8 text-muted">Confirm your email address to complete registration</p><Suspense fallback={<p role="status" className="rounded-input bg-surface-raised p-4">Loading verification...</p>}><VerifyForm /></Suspense></>;
}

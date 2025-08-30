// components/auth/TermsNote.tsx
"use client";

export default function TermsNote({
  termsHref = "/legal/terms",
  privacyHref = "/legal/privacy",
}: { termsHref?: string; privacyHref?: string }) {
  return (
    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground text-center">
      By continuing, you agree to our{" "}
      <a href={termsHref} className="underline underline-offset-2 hover:opacity-90">
        Terms
      </a>{" "}
      and{" "}
      <a href={privacyHref} className="underline underline-offset-2 hover:opacity-90">
        Privacy Policy
      </a>
      .
    </p>
  );
}

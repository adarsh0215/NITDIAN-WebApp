// components/auth/AuthCard.tsx
"use client";
import * as React from "react";

type Props = {
  title: string;
  subtitle?: string;
  /** Shown centered inside the divider line (e.g., "or continue with email") */
  dividerText?: string;
  /** Typically your OAuth buttons go here (e.g., GoogleAuthButton) */
  socialSlot?: React.ReactNode;
  /** The form contents (inputs + submit) */
  children: React.ReactNode;
  /** Optional footer below the form (e.g., “No account? Sign up”) */
  footer?: React.ReactNode;
  /** Elevation toggle */
  shadow?: boolean;
};

export default function AuthCard({
  title,
  subtitle,
  dividerText = "or continue with email",
  socialSlot,
  children,
  footer,
  shadow = true,
}: Props) {
  return (
    <div className={`rounded-2xl border bg-card ${shadow ? "shadow-sm" : ""} p-8 space-y-6`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>

      {/* Social */}
      {socialSlot}

      {/* Divider */}
      {dividerText ? (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] tracking-wider uppercase">
            <span className="bg-card px-2 text-muted-foreground">{dividerText}</span>
          </div>
        </div>
      ) : null}

      {/* Form slot */}
      {children}

      {/* Footer */}
      {footer ? <div className="pt-1">{footer}</div> : null}
    </div>
  );
}

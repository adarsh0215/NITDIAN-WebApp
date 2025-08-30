// components/layout/navbar/UserPill.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard, User as UserIcon, ChevronDown } from "lucide-react";

export type UserPillProps = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  variant?: "pill" | "stack";
  dashboardHref?: string;
  profileHref?: string;
  signOutHref?: string;
  onSignOut?: () => Promise<void> | void;
  className?: string;
};

function getInitials(input?: string): string {
  const base = (input || "").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).slice(0, 2);
  const letters = parts.map((p: string) => p[0]?.toUpperCase() ?? "");
  return letters.join("") || "U";
}

function AvatarCircle({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string;
  alt?: string;
  fallback: string;
  className?: string;
}) {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return (
      <div
        aria-hidden
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] font-medium",
          className
        )}
      >
        {fallback}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt ?? "Avatar"}
      width={32}
      height={32}
      onError={() => setError(true)}
      className={cn("h-8 w-8 rounded-full object-cover", className)}
    />
  );
}

export default function UserPill({
  name,
  email,
  avatarUrl,
  variant = "pill",
  dashboardHref = "/dashboard",
  profileHref = "/onboarding",
  signOutHref = "/auth/signout",
  onSignOut,
  className,
}: UserPillProps) {
  const display = name || email || "User";
  const initials = getInitials(name || email);

  if (variant === "stack") {
    return (
      <div className={cn("rounded-xl border bg-card p-3 shadow-sm", className)}>
        <div className="flex items-center gap-3">
          <AvatarCircle src={avatarUrl ?? undefined} alt={display} fallback={initials} className="h-10 w-10" />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-medium">{display}</div>
            {email && <div className="truncate text-sm text-muted-foreground">{email}</div>}
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          <Link href={dashboardHref} className="w-full">
            <Button variant="outline" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href={profileHref} className="w-full">
            <Button variant="outline" className="w-full justify-start gap-2">
              <UserIcon className="h-4 w-4" />
              Edit profile
            </Button>
          </Link>

          {onSignOut ? (
            <Button
              className="w-full justify-center"
              onClick={async () => {
                try {
                  await onSignOut();
                } catch {}
              }}
            >
              Sign out
            </Button>
          ) : (
            <form action={signOutHref} method="POST" className="w-full">
              <Button type="submit" className="w-full justify-center">
                Sign out
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group inline-flex items-center gap-2 rounded-full pl-1 pr-2 py-1 transition-colors",
            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
            className
          )}
          aria-label="Open user menu"
        >
          <AvatarCircle src={avatarUrl ?? undefined} alt={display} fallback={initials} />
          <span className="hidden max-w-[180px] truncate text-sm sm:block">{display}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="z-[80] w-60">
        <DropdownMenuLabel className="truncate">{display}</DropdownMenuLabel>
        {email && <div className="px-2 pb-1 text-xs text-muted-foreground truncate">{email}</div>}
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={dashboardHref} className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={profileHref} className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Edit profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {onSignOut ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={async () => {
              try {
                await onSignOut();
              } catch {}
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
            <form action={signOutHref} method="POST" className="w-full flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <button type="submit" className="w-full text-left">
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

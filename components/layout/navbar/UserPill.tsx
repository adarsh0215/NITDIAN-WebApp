// app/layout/navbar/UserPill.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function initialsFrom(name?: string | null, email?: string | null) {
  const base = (name || email || "U").trim();
  const letters =
    base
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() || "") // safe on empty
      .join("") || "U";
  return letters;
}

type Props = {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  /** Use "stack" inside mobile drawers to avoid nested popovers */
  variant?: "dropdown" | "stack";
};

export default function UserPill({
  name,
  email,
  avatarUrl,
  variant = "dropdown",
}: Props) {
  if (variant === "stack") {
    // Compact, dropdown-free block (great for mobile side panels)
    return (
      <div className="rounded-xl border p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name ?? "User"} />
            ) : (
              <AvatarFallback className="text-[11px]">
                {initialsFrom(name, email)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{name ?? "Member"}</div>
            {email && (
              <div className="truncate text-xs text-muted-foreground">{email}</div>
            )}
          </div>
        </div>

        <div className="mt-3 grid gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full rounded-lg">
              Dashboard
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button variant="outline" className="w-full rounded-lg">
              Edit Profile
            </Button>
          </Link>
          <form action="/auth/signout" method="post">
            <Button type="submit" className="w-full rounded-lg">
              Sign out
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Default: desktop dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center gap-2 rounded-full px-2 py-1 hover:bg-muted transition"
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name ?? "User"} />
            ) : (
              <AvatarFallback className="text-[11px]">
                {initialsFrom(name, email)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="hidden max-w-[160px] truncate text-sm lg:block">
            {name ?? email ?? "Member"}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="space-y-0.5">
          <div className="truncate font-medium">{name ?? "Member"}</div>
          {email && (
            <div className="truncate text-xs text-muted-foreground">{email}</div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/onboarding">Edit Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action="/auth/signout" method="post">
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full text-left">
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

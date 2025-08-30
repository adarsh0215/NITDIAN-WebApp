"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

import { ThemeToggle, useTheme } from "@/lib/design/theme";
import { toast } from "@/lib/design/toast";

/* New components */
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function Page() {
  const { mode, resolvedTheme } = useTheme();
  const [degree, setDegree] = React.useState<string>("btech");
  const [filters, setFilters] = React.useState<{ branch: boolean; yr2024: boolean }>({
    branch: true,
    yr2024: false,
  });

  return (
    <main className="container mx-auto max-w-5xl py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Design Preview{" "}
          <span className="text-muted-foreground">({mode}: {resolvedTheme})</span>
        </h1>
        <div className="flex items-center gap-2">
          {/* Avatar action menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground"
                aria-label="Open user menu"
              >
                A
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem inset>Profile</DropdownMenuItem>
              <DropdownMenuItem inset>Settings</DropdownMenuItem>
              <DropdownMenuItem inset>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">Overview</TabsTrigger>
              <TabsTrigger value="two">Details</TabsTrigger>
              <TabsTrigger value="three">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="one">Neutral palette, hairline borders, Geist-ish.</TabsContent>
            <TabsContent value="two">Keep radii 8–12px, subtle shadows.</TabsContent>
            <TabsContent value="three">Dark mode via data-theme.</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => toast.success("Saved successfully")}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive" onClick={() => toast.error("Something went wrong")}>
            Destructive
          </Button>
        </CardContent>
      </Card>

      {/* Inputs + Select */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs & Select</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input placeholder="Your name" />
          <Input placeholder="Email address" />
          <Select value={degree} onValueChange={setDegree}>
            <SelectTrigger>{degree === "btech" ? "B.Tech" : "M.Tech"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="btech">B.Tech</SelectItem>
              <SelectItem value="mtech">M.Tech</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Role</TH>
                <TH>Year</TH>
              </TR>
            </THead>
            <TBody>
              <TR>
                <TD>Adarsh</TD>
                <TD>Founder</TD>
                <TD>2025</TD>
              </TR>
              <TR>
                <TD>Anita</TD>
                <TD>Designer</TD>
                <TD>2024</TD>
              </TR>
              <TR>
                <TD>Rohit</TD>
                <TD>Engineer</TD>
                <TD>2023</TD>
              </TR>
            </TBody>
          </Table>
        </CardContent>
      </Card>

      {/* Badges, Switch, Toast */}
      <Card>
        <CardHeader>
          <CardTitle>Badges, Switch & Toast</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Badge>Default</Badge>
          <Badge className="bg-primary text-primary-foreground border-primary">Brand</Badge>
          <Switch checked={true} onCheckedChange={() => {}} />
          <Button variant="outline" onClick={() => toast("Heads up! This is a neutral toast.")}>
            Show toast
          </Button>
        </CardContent>
      </Card>

      {/* Popover example */}
      <Card>
        <CardHeader>
          <CardTitle>Popover (Filters)</CardTitle>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Filters</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-3">
                <div className="text-sm font-medium">Directory Filters</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.branch}
                    onChange={(e) => setFilters((f) => ({ ...f, branch: e.target.checked }))}
                  />
                  <span className="text-muted-foreground">Branch: CSE</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.yr2024}
                    onChange={(e) => setFilters((f) => ({ ...f, yr2024: e.target.checked }))}
                  />
                  <span className="text-muted-foreground">Grad Year: 2024</span>
                </label>
                <div className="pt-2">
                  <Button size="sm" onClick={() => toast.success("Filters applied")}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      <Textarea placeholder="Write something…" />
    </main>
  );
}

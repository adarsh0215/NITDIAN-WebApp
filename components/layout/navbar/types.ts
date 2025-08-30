// Shared types for the navbar
export type Brand = {
  title: string;
  subtitle?: string;
  logo: string; // public path or remote URL
};

export type NavLink = {
  href: string;
  label: string;
};

export type NavProfile = {
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

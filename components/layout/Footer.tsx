// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-10">
      <div className="container-std flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm subtle">
          © {new Date().getFullYear()} AlumniNet — NIT Durgapur Alumni
        </p>
        <nav className="flex items-center gap-4 text-sm">
          <a className="subtle hover:text-fg" href="/directory">Directory</a>
          <a className="subtle hover:text-fg" href="/onboarding">Onboarding</a>
          <a className="subtle hover:text-fg" href="/auth/login">Login</a>
        </nav>
      </div>
    </footer>
  );
}

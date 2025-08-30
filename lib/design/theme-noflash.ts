// lib/design/theme-noflash.ts
// Server-safe: exports a plain string. Using window/document is fine INSIDE the string.
export function getNoFlashScript() {
  return `
  (function(){
    try {
      var m = localStorage.getItem('theme-mode');
      var pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = (m === 'light' || m === 'dark') ? m : pref;
      document.documentElement.setAttribute('data-theme', theme);
      // keep Tailwind/shadcn dark: variants working
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch(e) {}
  })();
  `;
}

// lib/ui/motion.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] } },
};

export const stagger = { show: { transition: { staggerChildren: 0.08 } } };

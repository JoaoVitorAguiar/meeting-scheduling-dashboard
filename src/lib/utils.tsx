// utils.ts
export function cn(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

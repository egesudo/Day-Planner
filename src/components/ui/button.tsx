import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-transform transition-opacity duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:opacity-90",
        ghost:
          "bg-transparent text-ink hover:bg-ink/5 border border-transparent",
        outline:
          "border border-line bg-surface text-ink hover:bg-bg",
        danger: "bg-danger text-accent-fg hover:opacity-90",
      },
      size: {
        md: "h-11 px-4 text-sm rounded-[var(--radius-md)]",
        lg: "h-14 px-5 text-base rounded-[var(--radius-lg)]",
        icon: "size-12 rounded-[var(--radius-md)]",
        pill: "h-11 px-4 rounded-full text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

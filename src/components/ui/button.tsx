import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive matrix-glow-hover font-['Orbitron']",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
        destructive:
          "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400 hover:text-red-200 hover:shadow-[0_0_20px_rgba(255,68,68,0.3)]",
        outline:
          "border border-cyan-500/30 bg-transparent text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]",
        secondary:
          "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-green-500/30 hover:border-emerald-400 hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]",
        ghost:
          "text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(0,255,255,0.1)]",
        link: "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

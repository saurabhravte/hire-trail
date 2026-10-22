import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary: white fill, black text (dark) / black fill, white text (light).
        default:
          "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:opacity-100",
        // Secondary: transparent, 1px border, hover to the elevated surface.
        outline:
          "border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-accent aria-expanded:bg-accent",
        ghost:
          "text-foreground hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent",
        destructive:
          "bg-[color:var(--signal-red)]/12 text-[color:var(--signal-red)] border-[color:var(--signal-red)]/25 hover:bg-[color:var(--signal-red)]/18",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 has-data-[icon=inline-start]:pl-3 has-data-[icon=inline-end]:pr-3",
        xs: "h-7 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 rounded-md px-3 text-[0.8rem]",
        lg: "h-10 px-4",
        icon: "size-9",
        "icon-xs": "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 rounded-md",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

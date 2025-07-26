import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn-enhanced inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background focus-enhanced disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive:
          "bg-gradient-error text-destructive-foreground hover:shadow-[0_0_30px_hsl(0_84%_60%/0.4)] border-destructive/30",
        outline:
          "border border-border/50 bg-card/50 text-foreground hover:bg-accent/80 hover:text-accent-foreground hover:border-primary/30 glass-effect",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary border-secondary/30 glass-effect",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground glass-effect",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        success: "bg-gradient-success text-success-foreground hover:shadow-[0_0_30px_hsl(142_76%_50%/0.4)] border-success/30",
        warning: "bg-gradient-warning text-warning-foreground hover:shadow-[0_0_30px_hsl(38_92%_50%/0.4)] border-warning/30",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

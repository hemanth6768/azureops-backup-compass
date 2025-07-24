import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "badge-enhanced transition-all duration-200 focus-enhanced",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary/20 hover:bg-secondary/80",
        destructive:
          "badge-error hover:bg-destructive-muted/80",
        success:
          "badge-success hover:bg-success-muted/80", 
        warning:
          "badge-warning hover:bg-warning-muted/80",
        outline: "text-foreground border-border hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

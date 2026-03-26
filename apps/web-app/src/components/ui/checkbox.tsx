import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<HTMLButtonElement, any>(({ className, checked, onCheckedChange, ...props }, ref) => (
    <button
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-all",
            checked ? "bg-[#D4AF37] text-black border-[#D4AF37]" : "border-white/20 bg-transparent text-transparent",
            className
        )}
        {...props}
    >
        <Check className="h-3 w-3 font-bold" />
    </button>
))
Checkbox.displayName = "Checkbox"
export { Checkbox }

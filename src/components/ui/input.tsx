import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-cyan-300 placeholder:text-slate-400 selection:bg-cyan-500/20 selection:text-cyan-200 bg-slate-900/60 border-cyan-500/30 h-9 w-full min-w-0 rounded-md border backdrop-blur-md px-3 py-1 text-base shadow-lg transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-cyan-100 font-['Space_Mono']",
        "focus-visible:border-cyan-400 focus-visible:shadow-[0_0_15px_rgba(0,255,255,0.3)] focus-visible:bg-slate-800/80",
        "hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]",
        "aria-invalid:ring-red-500/30 aria-invalid:border-red-500/50 aria-invalid:shadow-[0_0_10px_rgba(255,68,68,0.2)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }

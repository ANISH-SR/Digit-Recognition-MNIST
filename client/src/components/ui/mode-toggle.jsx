import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Switch } from "./switch"
import { cn } from "@/lib/utils"

export function ModeToggle({ className }) {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        id="theme-switch"
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}

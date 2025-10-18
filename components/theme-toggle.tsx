"use client"

import { Moon, Sun } from "lucide-react"
import { useAtom } from "jotai"
import { themeAtom } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom)

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full" aria-label="Toggle theme">
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}

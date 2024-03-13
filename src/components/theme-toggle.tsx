"use client"

import { useTheme } from "next-themes"
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  if (theme === 'dark') return (
    <Button size='icon' onClick={() => setTheme('light')}>
      <Sun/>
    </Button>
  )

  else if (theme === 'light') return (
    <Button size='icon' onClick={() => setTheme('dark')}>
      <Moon/>
    </Button>
  )
}
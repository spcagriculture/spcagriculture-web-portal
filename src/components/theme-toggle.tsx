import * as React from "react";
import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

type ThemeToggleProps = {
  /** Match the slim top bar (dark strip) button styling */
  variant?: "topBar" | "default";
};

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { t } = useLanguage();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const topBarClasses =
    variant === "topBar"
      ? "text-background hover:text-background/80 hover:bg-transparent gap-2"
      : "";

  const triggerIcon =
    !mounted ? (
      <Sun className="h-4 w-4 shrink-0 opacity-60" />
    ) : resolvedTheme === "dark" ? (
      <Moon className="h-4 w-4 shrink-0" />
    ) : (
      <Sun className="h-4 w-4 shrink-0" />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={topBarClasses}
          disabled={!mounted}
          aria-label={t.common.theme}
        >
          {triggerIcon}
          <span className="hidden md:inline max-w-[7rem] truncate">{t.common.theme}</span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-accent font-medium" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          {t.common.themeLight}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-accent font-medium" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          {t.common.themeDark}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-accent font-medium" : ""}
        >
          <Monitor className="mr-2 h-4 w-4" />
          {t.common.themeSystem}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

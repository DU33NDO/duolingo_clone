"use client";

import Link from "next/link";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Header() {
  const [user] = useAtom(userAtom);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/courses" className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold text-primary">
              Duolingo
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/courses"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Courses
            </Link>
            <Link
              href="/chat"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Chat
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
          </nav>
        </div>

        {user && (
          <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <span className="text-sm font-medium text-muted-foreground">
              Welcome,
            </span>
            <span className="text-sm font-semibold">{user.name}</span>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-orange-100 dark:bg-orange-950 px-2 sm:px-3 py-1 rounded-full">
                  <span className="text-lg sm:text-xl">🔥</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400 text-sm sm:text-base">
                    {user.streak}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-100 dark:bg-yellow-950 px-2 sm:px-3 py-1 rounded-full">
                  <span className="text-lg sm:text-xl">⭐</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">
                    {user.xp}
                  </span>
                </div>
              </div>

              <ThemeToggle />

              <Link href="/profile">
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-base">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <nav className="flex flex-col gap-4 mt-8 pl-4">
                    <Link
                      href="/courses"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Courses
                    </Link>
                    <Link
                      href="/chat"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Chat
                    </Link>
                    <Link
                      href="/about"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/auth"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Login
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link href="/auth">
                <Button size="sm" className="sm:size-default">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

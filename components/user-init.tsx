"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/store";

export function UserInit() {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    // Check if user is already logged in on mount
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
            streak: 7, // Static value
            xp: 1250, // Static value
          });

          // Set user as online
          await fetch("/api/users/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isOnline: true }),
            credentials: "include",
          });
        }
      } catch (error) {
        console.log("[v0] Not authenticated");
      }
    };

    if (!user) {
      checkAuth();
    }

    // Set offline when page is closed
    const handleBeforeUnload = async () => {
      if (user) {
        await fetch("/api/users/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isOnline: false }),
          credentials: "include",
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user, setUser]);

  return null;
}

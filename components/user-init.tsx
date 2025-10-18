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
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser({
            id: data.user.id,
            name: data.user.username,
            email: data.user.email,
            streak: 7, // Static value
            xp: 1250, // Static value
          });
        }
      } catch (error) {
        console.log("[v0] Not authenticated");
      }
    };

    if (!user) {
      checkAuth();
    }
  }, [user, setUser]);

  return null;
}

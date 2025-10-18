"use client";

import type React from "react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/store";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.rePassword) {
      alert("Passwords do not match!");
      return;
    }

    setUser({
      id: "1",
      name: formData.username,
      email: formData.email,
      streak: 0,
      xp: 0,
    });

    router.push("/courses");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-2">
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rePassword">Confirm Password</Label>
                  <Input
                    id="rePassword"
                    type="password"
                    value={formData.rePassword}
                    onChange={(e) =>
                      setFormData({ ...formData, rePassword: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

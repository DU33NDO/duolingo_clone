"use client";

import type React from "react";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/store";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}

export default function ChatsPage() {
  const [user] = useAtom(userAtom);
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    // Create WebSocket connection
    const websocket = new WebSocket("wss://echo.websocket.org/");

    websocket.onopen = () => {
      console.log("[v0] WebSocket connected");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      console.log("[v0] Message received:", event.data);
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        // Echo server sends back the same message
        const newMessage: Message = {
          id: Date.now().toString(),
          username: "Echo",
          text: event.data,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    websocket.onerror = (error) => {
      console.error("[v0] WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("[v0] WebSocket disconnected");
    };

    return () => {
      websocket.close();
    };
  }, [user, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !ws || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      username: user.name,
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    ws.send(JSON.stringify(message));
    setInputMessage("");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Community Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 p-0">
              <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                <div className="space-y-4 py-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col gap-1 ${
                          message.username === user.name
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div className="text-xs text-muted-foreground">
                          {message.username}
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[70%] ${
                            message.username === user.name
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <form
                onSubmit={handleSendMessage}
                className="flex gap-2 px-6 pb-6"
              >
                <Input
                  placeholder="Type a message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

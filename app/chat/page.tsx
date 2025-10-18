"use client";

import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/store";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export default function ChatPage() {
  const [currentUser] = useAtom(userAtom);
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagePollingRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched users:", data.users);
        setUsers(data.users);
      } else {
        const errorData = await response.json();
        console.error("Error fetching users:", errorData);
        toast({
          title: "Error",
          description: errorData.error || "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  // Fetch messages for selected user
  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Update user online status
  const updateOnlineStatus = async (isOnline: boolean) => {
    try {
      await fetch("/api/users/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnline }),
        credentials: "include",
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Initialize
  useEffect(() => {
    if (!currentUser) return;

    const initialize = async () => {
      setIsLoading(true);
      await updateOnlineStatus(true);
      await fetchUsers();
      setIsLoading(false);
    };

    initialize();

    // Poll for users status updates
    const usersInterval = setInterval(fetchUsers, 5000);

    // Set offline on unmount
    return () => {
      clearInterval(usersInterval);
      updateOnlineStatus(false);
    };
  }, [currentUser]);

  // Handle user selection
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);

      // Poll for new messages every 2 seconds
      if (messagePollingRef.current) {
        clearInterval(messagePollingRef.current);
      }
      messagePollingRef.current = setInterval(() => {
        fetchMessages(selectedUser.id);
      }, 2000);
    }

    return () => {
      if (messagePollingRef.current) {
        clearInterval(messagePollingRef.current);
      }
    };
  }, [selectedUser]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !selectedUser || !currentUser) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedUser.id,
          content: inputMessage,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setInputMessage("");
      } else {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const lastSeen = new Date(date);
    const diff = now.getTime() - lastSeen.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          {/* Users List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-2 p-4">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-8">
                      Loading users...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p className="mb-2">No other users found</p>
                      <p className="text-xs">
                        Register more accounts to start chatting
                      </p>
                    </div>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? "bg-primary/10 border border-primary"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage
                              src={user.avatar}
                              alt={user.username}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <Circle
                            className={`absolute bottom-0 right-0 h-3 w-3 ${
                              user.isOnline
                                ? "fill-green-500 text-green-500"
                                : "fill-gray-400 text-gray-400"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {user.username}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.isOnline
                              ? "Online"
                              : formatLastSeen(user.lastSeen)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2">
            {selectedUser ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={selectedUser.avatar}
                          alt={selectedUser.username}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {selectedUser.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Circle
                        className={`absolute bottom-0 right-0 h-3 w-3 ${
                          selectedUser.isOnline
                            ? "fill-green-500 text-green-500"
                            : "fill-gray-400 text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {selectedUser.username}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {selectedUser.isOnline
                          ? "Online"
                          : `Last seen ${formatLastSeen(
                              selectedUser.lastSeen
                            )}`}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col">
                  <ScrollArea
                    className="h-[calc(100vh-360px)] p-4"
                    ref={scrollRef}
                  >
                    <div className="space-y-4">
                      {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                          No messages yet. Start the conversation!
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex flex-col gap-1 ${
                              message.senderId === currentUser.id
                                ? "items-end"
                                : "items-start"
                            }`}
                          >
                            <div
                              className={`rounded-lg px-4 py-2 max-w-[70%] ${
                                message.senderId === currentUser.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground"
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                            <div className="text-xs text-muted-foreground px-1">
                              {new Date(message.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  <form
                    onSubmit={handleSendMessage}
                    className="flex gap-2 p-4 border-t"
                  >
                    <Input
                      placeholder="Type a message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a user to start chatting
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

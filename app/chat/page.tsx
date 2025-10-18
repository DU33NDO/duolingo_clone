"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAtom } from "jotai"
import { userAtom } from "@/lib/store"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users, Circle } from "lucide-react"
import { useRouter } from "next/navigation"
import { WebSocketClient } from "@/lib/websocket"

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  timestamp: Date
}

interface ChatUser {
  id: string
  name: string
  avatar?: string
  online: boolean
}

export default function ChatPage() {
  const [user] = useAtom(userAtom)
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      userId: "2",
      userName: "Maria Garcia",
      content: "Hey! Anyone want to practice Spanish conversation?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      userId: "3",
      userName: "Jean Dupont",
      content: "I'm learning French! Would love to chat with native speakers.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "3",
      userId: "4",
      userName: "Hans Mueller",
      content: "Guten Tag! Looking for German practice partners.",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([
    { id: "2", name: "Maria Garcia", online: true },
    { id: "3", name: "Jean Dupont", online: true },
    { id: "4", name: "Hans Mueller", online: true },
    { id: "5", name: "Yuki Tanaka", online: false },
  ])
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsClient = useRef<WebSocketClient | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    // Initialize WebSocket client (simulated for demo)
    wsClient.current = new WebSocketClient()

    // Simulate WebSocket connection
    const simulateConnection = () => {
      setIsConnected(true)
      console.log("[v0] Simulated WebSocket connection established")
    }

    simulateConnection()

    // Cleanup
    return () => {
      if (wsClient.current) {
        wsClient.current.disconnect()
      }
    }
  }, [user, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate sending via WebSocket
    if (wsClient.current && wsClient.current.isConnected()) {
      wsClient.current.send({
        type: "message",
        data: message,
      })
    }

    // Simulate receiving a response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "Great point! I agree with you.",
        "I'm also learning that language!",
        "Thanks for sharing!",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        userId: "bot",
        userName: "Language Bot",
        content: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Online Users Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Online Users
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Circle className={`h-2 w-2 fill-current ${isConnected ? "text-green-500" : "text-red-500"}`} />
                {isConnected ? "Connected" : "Disconnected"}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-3">
                  {onlineUsers.map((chatUser) => (
                    <div
                      key={chatUser.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chatUser.avatar || "/placeholder.svg"} alt={chatUser.name} />
                          <AvatarFallback>{chatUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Circle
                          className={`absolute bottom-0 right-0 h-3 w-3 fill-current ${
                            chatUser.online ? "text-green-500" : "text-gray-400"
                          } ring-2 ring-background`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{chatUser.name}</div>
                        <div className="text-xs text-muted-foreground">{chatUser.online ? "Online" : "Offline"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Global Chat</CardTitle>
                <Badge variant="secondary" className="gap-1">
                  <Circle className="h-2 w-2 fill-current text-green-500" />
                  {onlineUsers.filter((u) => u.online).length} online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-20rem)] px-6">
                <div className="space-y-4 py-4">
                  {messages.map((message) => {
                    const isOwnMessage = message.userId === user.id

                    return (
                      <div key={message.id} className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarImage src={message.userAvatar || "/placeholder.svg"} alt={message.userName} />
                          <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className={`flex flex-col gap-1 max-w-[70%] ${isOwnMessage ? "items-end" : ""}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{message.userName}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                          </div>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={!isConnected}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim() || !isConnected}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

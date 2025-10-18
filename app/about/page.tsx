"use client";

import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Users,
  MessageSquare,
  Trophy,
  Target,
  Heart,
  Zap,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: Globe,
      title: "40+ Languages",
      description:
        "Learn from the world's most popular languages to rare and endangered ones",
    },
    {
      icon: Users,
      title: "500M+ Learners",
      description:
        "Join millions of people learning languages together worldwide",
    },
    {
      icon: MessageSquare,
      title: "Real Conversations",
      description: "Practice with native speakers and AI-powered chat partners",
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn XP, unlock achievements, and compete with friends",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Effective",
      description: "Our courses are backed by science and proven to work",
      color: "text-blue-500",
    },
    {
      icon: Heart,
      title: "Accessible",
      description: "Free language education for everyone, everywhere",
      color: "text-red-500",
    },
    {
      icon: Zap,
      title: "Engaging",
      description: "Fun, bite-sized lessons that fit into your daily routine",
      color: "text-yellow-500",
    },
    {
      icon: BookOpen,
      title: "Comprehensive",
      description: "From beginner to advanced, we've got you covered",
      color: "text-green-500",
    },
  ];

  const stats = [
    { label: "Active Users", value: "500M+" },
    { label: "Languages", value: "40+" },
    { label: "Lessons Completed", value: "10B+" },
    { label: "Countries", value: "190+" },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Education",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Aisha Patel",
      role: "Lead Developer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Thomas Mueller",
      role: "UX Designer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4" variant="secondary">
            About Duolingo
          </Badge>
          <h1 className="text-5xl font-bold mb-4 text-balance">
            Making Language Learning Accessible to Everyone
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            We believe that everyone should have access to free, high-quality
            language education. Our mission is to make learning fun, effective,
            and accessible to all.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Duolingo?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-lg bg-muted flex items-center justify-center ${value.color}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join millions of learners worldwide and start your language
              learning journey today. It's free, fun, and effective!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                >
                  Browse Courses
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

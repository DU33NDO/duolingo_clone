"use client";

import { useAtom } from "jotai";
import { userAtom, coursesAtom } from "@/lib/store";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Trophy, Flame, Star, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [user, setUser] = useAtom(userAtom);
  const [courses] = useAtom(coursesAtom);
  const router = useRouter();
  const { toast } = useToast();

  if (!user) {
    router.push("/auth");
    return null;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        toast({
          title: "Logged out",
          description: "You've been successfully logged out.",
        });
        router.push("/auth");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const achievements = [
    {
      id: 1,
      name: "First Lesson",
      description: "Complete your first lesson",
      icon: "🎯",
      unlocked: true,
    },
    {
      id: 2,
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      unlocked: true,
    },
    {
      id: 3,
      name: "Polyglot",
      description: "Learn 3 languages",
      icon: "🌍",
      unlocked: true,
    },
    {
      id: 4,
      name: "XP Master",
      description: "Earn 1000 XP",
      icon: "⭐",
      unlocked: true,
    },
    {
      id: 5,
      name: "Early Bird",
      description: "Complete a lesson before 8 AM",
      icon: "🌅",
      unlocked: false,
    },
    {
      id: 6,
      name: "Night Owl",
      description: "Complete a lesson after 10 PM",
      icon: "🦉",
      unlocked: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <Flame className="h-6 w-6 text-orange-500 mb-2" />
                    <div className="text-2xl font-bold text-orange-500">
                      {user.streak}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Day Streak
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold text-yellow-500">
                      {user.xp}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total XP
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Level Progress
                    </span>
                    <span className="font-medium">Level 12</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    350 XP to Level 13
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Active Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{course.flag}</span>
                      <div>
                        <div className="font-medium text-sm">{course.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Level {course.level}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">{course.progress}%</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="achievements">
                  <Trophy className="h-4 w-4 mr-2" />
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>
                      Unlock badges by completing challenges
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {achievements.map((achievement) => (
                        <Card
                          key={achievement.id}
                          className={
                            achievement.unlocked
                              ? "border-primary/50"
                              : "opacity-60"
                          }
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="text-4xl">{achievement.icon}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">
                                  {achievement.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {achievement.description}
                                </p>
                                {achievement.unlocked && (
                                  <Badge className="mt-2" variant="default">
                                    Unlocked
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" placeholder="Tell us about yourself" />
                    </div>
                    <Button className="w-full">Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Preferences</CardTitle>
                    <CardDescription>
                      Customize your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Daily Goal</div>
                        <div className="text-sm text-muted-foreground">
                          Set your daily XP target
                        </div>
                      </div>
                      <Badge variant="outline">20 XP</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Reminder notifications
                        </div>
                      </div>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Sound Effects</div>
                        <div className="text-sm text-muted-foreground">
                          Audio feedback
                        </div>
                      </div>
                      <Badge variant="outline">On</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive">
                      Danger Zone
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}

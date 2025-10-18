"use client";

import { useAtom } from "jotai";
import { coursesAtom, userAtom } from "@/lib/store";
import { Header } from "@/components/header";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import type { CourseDetails } from "@/lib/store";

export default function CoursesPage() {
  const [courses] = useAtom(coursesAtom);
  const [user, setUser] = useAtom(userAtom);
  const [selectedCourse, setSelectedCourse] = useState<CourseDetails | null>(
    null
  );

  useEffect(() => {
    if (!user) {
      setUser({
        id: "1",
        name: "Alex Johnson",
        email: "alex@example.com",
        streak: 7,
        xp: 1250,
      });
    }
  }, [user, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />

      <main className="py-6 sm:py-8">
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Language
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
            Start your language learning journey today
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="group relative aspect-square bg-card hover:bg-accent/10 rounded-2xl sm:rounded-3xl border-2 border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-6xl sm:text-7xl lg:text-8xl transition-transform group-hover:scale-110 relative z-10">
                {course.flag}
              </span>
              <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center">
                <span className="text-xs sm:text-sm font-semibold text-foreground/80 group-hover:text-primary transition-colors">
                  {course.language}
                </span>
              </div>
            </button>
          ))}
        </div>

        <Dialog
          open={!!selectedCourse}
          onOpenChange={() => setSelectedCourse(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-5xl sm:text-6xl">
                  {selectedCourse?.flag}
                </span>
                <div>
                  <DialogTitle className="text-xl sm:text-2xl">
                    {selectedCourse?.name}
                  </DialogTitle>
                  <Badge variant="secondary" className="mt-1">
                    {selectedCourse?.difficulty}
                  </Badge>
                </div>
              </div>
              <DialogDescription className="text-base pt-2">
                {selectedCourse?.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Lessons</p>
                  <p className="text-muted-foreground">
                    {selectedCourse?.lessons} interactive lessons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">
                    {selectedCourse?.duration} to complete
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-chart-3/10">
                  <TrendingUp className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="font-medium">Level</p>
                  <p className="text-muted-foreground">
                    {selectedCourse?.difficulty}
                  </p>
                </div>
              </div>

              {!selectedCourse?.available && (
                <div className="flex items-start gap-3 p-4 bg-muted rounded-lg mt-4">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">
                      Not Available Yet
                    </p>
                    <p className="text-muted-foreground mt-1">
                      This course is currently under development. Check back
                      soon!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

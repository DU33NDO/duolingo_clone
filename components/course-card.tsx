import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/store"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{course.flag}</span>
            <div>
              <CardTitle className="text-xl">{course.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Level {course.level}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{course.progress}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>

        <Button className="w-full" size="lg">
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  )
}

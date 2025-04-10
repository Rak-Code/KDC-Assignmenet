
import React from 'react';
import { Course } from '@/lib/data';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <img 
          src={course.imageUrl} 
          alt={course.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-medium">
            {course.level}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{course.batches.length} {course.batches.length === 1 ? 'Batch' : 'Batches'}</span>
          </div>
          {course.batches.map(batch => (
            <div key={batch.id} className="ml-6 text-sm flex items-center">
              <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
              <span>{batch.description}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">View Details</Button>
        <Button size="sm">Schedule Lecture</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;

import React, { useState } from 'react';
import { Instructor } from '@/lib/types';
import { deleteInstructor } from '@/lib/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface InstructorCardProps {
  instructor: Instructor;
  onDeleted?: () => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onDeleted }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const viewSchedule = () => {
    toast({
      title: "Viewing schedule",
      description: `Opening ${instructor.name}'s teaching schedule`,
    });
    // In a real app, this would navigate to a schedule view for this instructor
    // navigate(`/admin/instructors/${instructor.id}/schedule`);
  };

  const assignLecture = () => {
    toast({
      title: "Assign Lecture",
      description: `Opening form to assign lecture to ${instructor.name}`,
    });
    // In a real app, this would open a modal or navigate to an assignment form
    // navigate(`/admin/lectures/assign/${instructor.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      setIsDeleting(true);
      try {
        await deleteInstructor(instructor._id);
        toast({
          title: "Success",
          description: "Instructor deleted successfully",
        });
        onDeleted?.();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete instructor",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row space-x-4 items-center pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={instructor.imageUrl} alt={instructor.name} />
          <AvatarFallback>{getInitials(instructor.name)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{instructor.name}</CardTitle>
          <CardDescription>{instructor.expertise}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm mb-2">
          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
          <a href={`mailto:${instructor.email}`} className="text-primary hover:underline">
            {instructor.email}
          </a>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>{instructor.lectures?.length || 0} scheduled lectures</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={viewSchedule}
          className="flex items-center"
        >
          <Calendar className="h-4 w-4 mr-1" />
          View Schedule
        </Button>
        <Button 
          size="sm" 
          onClick={assignLecture}
          className="flex items-center"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Assign Lecture
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InstructorCard;

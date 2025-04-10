import React, { useState, useEffect } from 'react';
import { getCourses } from '@/lib/api';
import type { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import CourseCard from './CourseCard';
import { PlusCircle } from 'lucide-react';
import CourseForm from './CourseForm';
import { useToast } from '@/components/ui/use-toast';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseFormOpen, setCourseFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseAdded = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button onClick={() => setCourseFormOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard 
              key={course._id} 
              course={course} 
              onDeleted={fetchCourses}
            />
          ))}
        </div>
      )}
      
      <CourseForm 
        open={courseFormOpen} 
        onOpenChange={setCourseFormOpen}
        onCourseAdded={handleCourseAdded}
      />
    </div>
  );
};

export default CourseManagement;

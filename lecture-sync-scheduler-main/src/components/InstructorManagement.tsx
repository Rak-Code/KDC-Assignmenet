import React, { useState, useEffect } from 'react';
import { getInstructors } from '@/lib/api';
import type { Instructor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import InstructorCard from './InstructorCard';
import { PlusCircle } from 'lucide-react';
import InstructorForm from './InstructorForm';
import { useToast } from '@/components/ui/use-toast';

const InstructorManagement: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [instructorFormOpen, setInstructorFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchInstructors = async () => {
    try {
      const data = await getInstructors();
      setInstructors(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch instructors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleInstructorAdded = (newInstructor: Instructor) => {
    setInstructors(prev => [...prev, newInstructor]);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Instructor Management</h2>
        <Button onClick={() => setInstructorFormOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Instructor
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map(instructor => (
            <InstructorCard 
              key={instructor._id} 
              instructor={instructor}
              onDeleted={fetchInstructors}
            />
          ))}
        </div>
      )}
      
      <InstructorForm 
        open={instructorFormOpen} 
        onOpenChange={setInstructorFormOpen}
        onInstructorAdded={handleInstructorAdded}
      />
    </div>
  );
};

export default InstructorManagement;

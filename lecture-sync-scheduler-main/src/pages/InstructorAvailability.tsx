
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { addLecture, instructors, courses } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/components/ui/use-toast";

const InstructorAvailability: React.FC = () => {
  const { isAuthenticated, role, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('Online');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [details, setDetails] = useState('Available for lectures');
  
  // Protect this route
  if (!isAuthenticated || role !== 'instructor') {
    return <Navigate to="/login" />;
  }

  // Find the instructor
  const instructor = instructors.find(i => i.id === user?.id) || instructors[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !startTime || !endTime || !selectedCourse || !selectedBatch) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Check if end time is after start time
    if (startTime >= endTime) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    const newLecture = addLecture({
      courseId: selectedCourse,
      batchId: selectedBatch,
      instructorId: instructor.id,
      date: formattedDate,
      startTime,
      endTime,
      details,
      location
    });
    
    toast({
      title: "Availability scheduled",
      description: `You've scheduled your availability on ${format(selectedDate, 'MMMM d, yyyy')} from ${startTime} to ${endTime}`,
      variant: "default"
    });
    
    // Reset form
    setDetails('Available for lectures');
    setSelectedBatch('');
  };
  
  // Filter batches based on selected course
  const selectedCourseObj = courses.find(c => c.id === selectedCourse);
  const batches = selectedCourseObj ? selectedCourseObj.batches : [];
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Schedule Your Availability</h1>
          <p className="text-muted-foreground">Set the dates and times when you're available to teach</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>Choose when you're available to teach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className={cn("rounded-md border")}
                  disabled={(date) => date < new Date()}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="startTime" 
                      type="time" 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="endTime" 
                      type="time" 
                      value={endTime} 
                      onChange={(e) => setEndTime(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Online or physical location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Select the course and batch you're available for</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch</Label>
                  <Select
                    value={selectedBatch}
                    onValueChange={setSelectedBatch}
                    disabled={!selectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={!selectedCourse ? "Select a course first" : "Select a batch"} />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name} - {batch.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="details">Details</Label>
                  <Input 
                    id="details" 
                    placeholder="Additional details" 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)} 
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Check className="h-4 w-4 mr-2" />
                  Schedule Availability
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorAvailability;

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCourses, getInstructors, createLecture } from '@/lib/api';
import { Course, Instructor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface LectureFormProps {
  onClose: () => void;
}

const LectureForm: React.FC<LectureFormProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [formData, setFormData] = useState({
    courseId: '',
    instructorId: '',
    date: '',
    startTime: '',
    endTime: '',
    details: '',
    location: '', // Added location property
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCourses, fetchedInstructors] = await Promise.all([
          getCourses(),
          getInstructors(),
        ]);
        setCourses(fetchedCourses);
        setInstructors(fetchedInstructors);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch data. Please try again.',
          variant: 'destructive',
        });
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear errors when field is changed
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      setFormData({ ...formData, date: dateStr });

      // Clear date error when date is selected
      if (errors.date) {
        const newErrors = { ...errors };
        delete newErrors.date;
        setErrors(newErrors);
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseId) newErrors.courseId = 'Please select a course';
    if (!formData.instructorId) newErrors.instructorId = 'Please select an instructor';
    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.startTime) newErrors.startTime = 'Please enter a start time';
    if (!formData.endTime) newErrors.endTime = 'Please enter an end time';
    if (!formData.details) newErrors.details = 'Please enter lecture details';

    // Check if end time is after start time
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        if (!selectedDate) {
          throw new Error('Date is required');
        }

        const lectureData = {
          course: formData.courseId,
          instructor: formData.instructorId,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: formData.startTime,
          endTime: formData.endTime,
          details: formData.details,
          location: 'Online'
        };

        console.log('Sending lecture data:', lectureData);
        await createLecture(lectureData);

        toast({
          title: 'Success',
          description: 'Lecture scheduled successfully',
        });
        onClose();
      } catch (error: unknown) {
        console.error('Lecture scheduling error:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to schedule lecture',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Course Select */}
      <div className="space-y-2">
        <Label htmlFor="course">Course</Label>
        <Select
          value={formData.courseId}
          onValueChange={value => handleInputChange('courseId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Courses</SelectLabel>
              {courses.length > 0 ? (
                courses.map(course => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.name} ({course.level})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-courses" disabled>
                  No courses available
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.courseId && <p className="text-destructive text-sm">{errors.courseId}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="instructor">Instructor</Label>
        <Select
          value={formData.instructorId}
          onValueChange={value => handleInputChange('instructorId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an instructor" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Instructors</SelectLabel>
              {instructors.length > 0 ? (
                instructors.map(instructor => (
                  <SelectItem key={instructor._id} value={instructor._id}>
                    {instructor.name} - {instructor.expertise}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-instructors" disabled>
                  No instructors available
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.instructorId && <p className="text-destructive text-sm">{errors.instructorId}</p>}
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-destructive text-sm">{errors.date}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <div className="relative">
            <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={e => handleInputChange('startTime', e.target.value)}
              className="pl-8"
            />
          </div>
          {errors.startTime && <p className="text-destructive text-sm">{errors.startTime}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <div className="relative">
            <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={e => handleInputChange('endTime', e.target.value)}
              className="pl-8"
            />
          </div>
          {errors.endTime && <p className="text-destructive text-sm">{errors.endTime}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="details">Lecture Details</Label>
        <Textarea
          id="details"
          placeholder="Enter details about the lecture"
          value={formData.details}
          onChange={e => handleInputChange('details', e.target.value)}
        />
        {errors.details && <p className="text-destructive text-sm">{errors.details}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Scheduling...' : 'Schedule Lecture'}
        </Button>
      </div>
    </form>
  );
};

export default LectureForm;

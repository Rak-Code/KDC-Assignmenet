import { format } from 'date-fns';

export interface Course {
  id: string;
  name: string;
  level: string;
  description: string;
  imageUrl: string;
  batches: Batch[];
}

export interface Batch {
  id: string;
  name: string;
  description: string;
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  expertise: string;
  imageUrl: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  batchId: string;
  instructorId: string;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  location?: string;
  students?: string;
}

// Mock data
export const courses: Course[] = [
  {
    id: "c1",
    name: "Introduction to React",
    level: "Beginner",
    description: "Learn the fundamentals of React, including components, props, and state management.",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070",
    batches: [
      { id: "b1", name: "Morning Batch", description: "8:00 AM - 10:00 AM" },
      { id: "b2", name: "Evening Batch", description: "6:00 PM - 8:00 PM" }
    ]
  },
  {
    id: "c2",
    name: "Advanced JavaScript",
    level: "Intermediate",
    description: "Dive deep into JavaScript concepts including closures, prototypes, and async programming.",
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074",
    batches: [
      { id: "b3", name: "Weekend Batch", description: "Saturday 10:00 AM - 1:00 PM" }
    ]
  },
  {
    id: "c3",
    name: "Node.js Backend Development",
    level: "Intermediate",
    description: "Build robust backend systems with Node.js, Express, and MongoDB.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1934",
    batches: [
      { id: "b4", name: "Afternoon Batch", description: "2:00 PM - 4:00 PM" }
    ]
  },
];

export const instructors: Instructor[] = [
  {
    id: "i1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    expertise: "React, Frontend Development",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976",
  },
  {
    id: "i2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    expertise: "JavaScript, TypeScript",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974",
  },
  {
    id: "i3",
    name: "Aisha Patel",
    email: "aisha.patel@example.com",
    expertise: "Node.js, Backend Development",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961",
  },
];

// Get current date and the next 30 days for calendar view
const today = new Date();
export const calendarDays: string[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(today.getDate() + i);
  return format(date, 'yyyy-MM-dd');
});

export const lectures: Lecture[] = [
  {
    id: "l1",
    courseId: "c1",
    batchId: "b1",
    instructorId: "i1",
    date: calendarDays[3],
    startTime: "08:00",
    endTime: "10:00",
    details: "Introduction to React Components"
  },
  {
    id: "l2",
    courseId: "c2",
    batchId: "b3",
    instructorId: "i2",
    date: calendarDays[5],
    startTime: "10:00",
    endTime: "13:00",
    details: "Advanced JS Concepts: Closures and Prototypes"
  },
  {
    id: "l3",
    courseId: "c1",
    batchId: "b2",
    instructorId: "i1",
    date: calendarDays[1],
    startTime: "18:00",
    endTime: "20:00",
    details: "State Management in React"
  },
  {
    id: "l4",
    courseId: "c3",
    batchId: "b4",
    instructorId: "i3",
    date: calendarDays[4],
    startTime: "14:00",
    endTime: "16:00",
    details: "Building REST APIs with Express"
  },
];

// Helper function to get course name by ID
export function getCourseName(courseId: string): string {
  const course = courses.find(c => c.id === courseId);
  return course ? course.name : "Unknown Course";
}

// Helper function to get batch name by ID
export function getBatchName(courseId: string, batchId: string): string {
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const batch = course.batches.find(b => b.id === batchId);
    return batch ? batch.name : "Unknown Batch";
  }
  return "Unknown Batch";
}

// Helper function to get instructor name by ID
export function getInstructorName(instructorId: string): string {
  const instructor = instructors.find(i => i.id === instructorId);
  return instructor ? instructor.name : "Unknown Instructor";
}

// Helper function to get lectures for a specific date
export function getLecturesForDate(date: string): Lecture[] {
  return lectures.filter(lecture => lecture.date === date);
}

// Helper function to check if an instructor is available at a given date and time
export function isInstructorAvailable(instructorId: string, date: string, startTime: string, endTime: string, excludeLectureId?: string): boolean {
  const instructorLectures = lectures.filter(
    lecture => lecture.instructorId === instructorId && 
               lecture.date === date && 
               (excludeLectureId ? lecture.id !== excludeLectureId : true)
  );
  
  if (instructorLectures.length === 0) return true;
  
  // Convert time to minutes for easier comparison
  const convertTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const newStartMinutes = convertTimeToMinutes(startTime);
  const newEndMinutes = convertTimeToMinutes(endTime);
  
  // Check for time conflicts
  return !instructorLectures.some(lecture => {
    const lectureStartMinutes = convertTimeToMinutes(lecture.startTime);
    const lectureEndMinutes = convertTimeToMinutes(lecture.endTime);
    
    // Check if there's an overlap
    return (
      (newStartMinutes >= lectureStartMinutes && newStartMinutes < lectureEndMinutes) ||
      (newEndMinutes > lectureStartMinutes && newEndMinutes <= lectureEndMinutes) ||
      (newStartMinutes <= lectureStartMinutes && newEndMinutes >= lectureEndMinutes)
    );
  });
}

// Mock function to add a lecture (would connect to backend API in a real application)
export function addLecture(lecture: Omit<Lecture, "id">): Lecture {
  const newLecture: Lecture = {
    ...lecture,
    id: `l${lectures.length + 1}`,
  };
  lectures.push(newLecture);
  return newLecture;
}

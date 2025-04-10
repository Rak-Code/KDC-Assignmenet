
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { lectures, getCourseName, getBatchName, instructors } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, BookOpen, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InstructorDashboard: React.FC = () => {
  const { isAuthenticated, role, user } = useAuth();
  
  // Protect this route
  if (!isAuthenticated || role !== 'instructor') {
    return <Navigate to="/login" />;
  }

  // For demo purposes, we'll show all lectures
  // In a real app, we would filter by the logged-in instructor ID
  const instructorLectures = lectures;
  
  // Group lectures by course for the Courses tab
  const lecturesByCourse = instructorLectures.reduce((acc, lecture) => {
    const courseName = getCourseName(lecture.courseId);
    
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    
    acc[courseName].push(lecture);
    return acc;
  }, {} as Record<string, typeof lectures>);
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
          <p className="text-muted-foreground">View your scheduled lectures and course details</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Lectures</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{instructorLectures.length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled lectures for this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Current Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(instructorLectures.map(l => l.courseId)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Active courses you're teaching
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Next Lecture</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {instructorLectures.length > 0 ? format(new Date(instructorLectures[0].date), 'MMM d, yyyy') : 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                {instructorLectures.length > 0 ? `${instructorLectures[0].startTime} - ${instructorLectures[0].endTime}` : 'No upcoming lectures'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Lectures</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <h2 className="text-xl font-semibold mb-4">Your Upcoming Lectures</h2>
            
            <div className="space-y-4">
              {instructorLectures.map(lecture => (
                <Card key={lecture.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-muted p-4 flex flex-col justify-center">
                      <div className="text-center mb-2">
                        <h3 className="font-bold">{format(new Date(lecture.date), 'EEEE')}</h3>
                        <div className="text-3xl font-bold my-1">{format(new Date(lecture.date), 'd')}</div>
                        <div>{format(new Date(lecture.date), 'MMMM yyyy')}</div>
                      </div>
                      <div className="text-center mt-2">
                        <Badge variant="outline" className="font-medium">
                          {lecture.startTime} - {lecture.endTime}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="md:w-2/3 p-4">
                      <div className="mb-4">
                        <CardTitle className="text-lg mb-1">{getCourseName(lecture.courseId)}</CardTitle>
                        <CardDescription>
                          {getBatchName(lecture.courseId, lecture.batchId)}
                        </CardDescription>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{lecture.location || 'Online'}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{lecture.students || '25'} Students</span>
                        </div>
                        <div>
                          <p className="text-sm mt-2">{lecture.details}</p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
              
              {instructorLectures.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No lectures scheduled yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <h2 className="text-xl font-semibold mb-4">Courses You Teach</h2>
            
            <div className="space-y-6">
              {Object.entries(lecturesByCourse).map(([courseName, courseLectures]) => (
                <Card key={courseName}>
                  <CardHeader>
                    <CardTitle>{courseName}</CardTitle>
                    <CardDescription>
                      {courseLectures.length} scheduled {courseLectures.length === 1 ? 'lecture' : 'lectures'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {courseLectures.map(lecture => (
                      <div key={lecture.id} className="flex justify-between items-center border-b py-2 last:border-0">
                        <div>
                          <p className="font-medium">{getBatchName(lecture.courseId, lecture.batchId)}</p>
                          <p className="text-sm text-muted-foreground">{lecture.details}</p>
                        </div>
                        <div className="text-right">
                          <p>{format(new Date(lecture.date), 'MMM d, yyyy')}</p>
                          <p className="text-sm text-muted-foreground">{lecture.startTime} - {lecture.endTime}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstructorDashboard;

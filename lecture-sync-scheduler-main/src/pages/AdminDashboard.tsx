import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Calendar from '@/components/Calendar';
import CourseManagement from '@/components/CourseManagement';
import InstructorManagement from '@/components/InstructorManagement';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { getLectures } from '@/lib/api';
import { Lecture } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [lectures, setLectures] = useState<Lecture[]>([]);

  // Get tab from URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab === 'courses' || tab === 'instructors') {
      setActiveTab(tab);
    } else {
      setActiveTab('calendar');
    }
  }, [location.search]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin${value !== 'calendar' ? `?tab=${value}` : ''}`);
  };

  // Fetch lectures
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const fetchedLectures = await getLectures();
        setLectures(fetchedLectures);
      } catch (error) {
        console.error('Failed to fetch lectures:', error);
      }
    };
    fetchLectures();
  }, []);

  // Protect this route
  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses, instructors and lecture schedule</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lectures.length}</div>
            </CardContent>
          </Card>
          {/* Add other cards here */}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <Calendar />
          </TabsContent>

          <TabsContent value="courses">
            <CourseManagement />
          </TabsContent>

          <TabsContent value="instructors">
            <InstructorManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

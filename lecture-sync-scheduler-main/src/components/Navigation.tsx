
import React from 'react';
import { CalendarDays, BookOpen, Users, LogIn, LogOut, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };
  
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarDays className="h-6 w-6 text-primary mr-2" />
            <Link to="/" className="text-xl font-bold">LectureSync</Link>
          </div>
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-1">
              {role === 'admin' && (
                <>
                  <Button 
                    variant="ghost" 
                    className={cn("tab-button", location.pathname === "/admin" && !location.search ? "text-primary" : "")}
                    onClick={() => navigate('/admin')}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    className={cn("tab-button", location.search.includes("tab=courses") ? "text-primary" : "")}
                    onClick={() => navigate('/admin?tab=courses')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Courses
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    className={cn("tab-button", location.search.includes("tab=instructors") ? "text-primary" : "")}
                    onClick={() => navigate('/admin?tab=instructors')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Instructors
                  </Button>
                </>
              )}
              
              {role === 'instructor' && (
                <>
                  <Button 
                    variant="ghost" 
                    className={cn("tab-button", location.pathname === "/instructor" && !location.search ? "text-primary" : "")}
                    onClick={() => navigate('/instructor')}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    My Lectures
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={cn("tab-button", location.pathname === "/instructor/availability" ? "text-primary" : "")}
                    onClick={() => navigate('/instructor/availability')}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    My Availability
                  </Button>
                </>
              )}
            </nav>
          )}
          
          <div>
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => {
                logout(); 
                navigate('/login');
              }}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/login')}>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;

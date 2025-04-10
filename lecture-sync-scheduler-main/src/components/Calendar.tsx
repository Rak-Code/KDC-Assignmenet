import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { calendarDays, getBatchName, getInstructorName } from '@/lib/data';
import { getLectures } from '@/lib/api';
import { Lecture } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LectureForm from './LectureForm';
import { CalendarPlus, ChevronLeft, ChevronRight, Info } from 'lucide-react';

const Calendar: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isAddingLecture, setIsAddingLecture] = useState(false);

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

  const displayDays = calendarDays.slice(startIndex, startIndex + 7);

  // Move calendar view
  const goToPreviousWeek = () => {
    if (startIndex >= 7) {
      setStartIndex(startIndex - 7);
    }
  };

  const goToNextWeek = () => {
    if (startIndex + 7 < calendarDays.length) {
      setStartIndex(startIndex + 7);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Lecture Schedule</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={goToPreviousWeek} disabled={startIndex === 0}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" onClick={goToNextWeek} disabled={startIndex + 7 >= calendarDays.length}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button onClick={() => setIsAddingLecture(true)}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Schedule Lecture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {displayDays.map(day => (
          <div key={`header-${day}`} className="calendar-day-header">
            {format(parseISO(day), 'EEE, MMM d')}
          </div>
        ))}

        {/* Calendar cells */}
        {displayDays.map(day => {
          const dayLectures = lectures.filter(lecture => new Date(lecture.date).toDateString() === new Date(day).toDateString());
          return (
            <div key={`day-${day}`} className="calendar-day">
              {dayLectures.map(lecture => (
                <div 
                  key={lecture._id}
                  className="lecture-item"
                  onClick={() => setSelectedLecture(lecture._id)}
                >
                  <div className="font-semibold">{typeof lecture.course === 'object' ? lecture.course.name : lecture.course}</div>
                  <div>{lecture.startTime} - {lecture.endTime}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add Lecture Dialog */}
      <Dialog open={isAddingLecture} onOpenChange={setIsAddingLecture}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule New Lecture</DialogTitle>
            <DialogDescription>
              Select a course, instructor, and date to schedule a new lecture.
            </DialogDescription>
          </DialogHeader>
          <LectureForm onClose={() => setIsAddingLecture(false)} />
        </DialogContent>
      </Dialog>

      {/* Lecture Details Dialog */}
      {selectedLecture && lectures.find(l => l._id === selectedLecture) && (
        <Dialog open={!!selectedLecture} onOpenChange={() => setSelectedLecture(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lecture Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(() => {
                const lecture = lectures.find(l => l._id === selectedLecture);
                if (!lecture) return null;

                return (
                  <>
                    <div className="flex items-start space-x-2">
                      <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">{typeof lecture.course === 'object' ? lecture.course.name : lecture.course}</h3>
                        <p className="text-sm text-muted-foreground">{getBatchName(lecture.course.id, lecture.batch.id)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p>{format(lecture.date, 'MMMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time</p>
                        <p>{lecture.startTime} - {lecture.endTime}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Instructor</p>
                        <p>{typeof lecture.instructor === 'string' ? getInstructorName(lecture.instructor) : lecture.instructor.name || "Unknown Instructor"}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium">Details</p>
                      <p className="text-sm">{lecture.details}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Calendar;

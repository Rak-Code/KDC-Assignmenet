import { useEffect, useState } from 'react';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../lib/api';
import { Course } from '../lib/types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface CourseFormData {
  name: string;
  description: string;
  duration: number;
  level: string;
  batches: number;
}

export const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: '',
    duration: 0,
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenForm = (course?: Course) => {
    setError('');
    if (course) {
      setSelectedCourse(course);
      setFormData({
        duration: course.duration,
        level: course.level || '',
        batches: course.batches || 0,
        description: course.description,
      setFormData({ name: '', description: '', duration: 0, level: '', batches: 0 });
      });
    } else {
      setSelectedCourse(null);
      setFormData({ name: '', description: '', duration: 0 });
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setError('');
    setSaving(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setError('');
    setDeleting(false);
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      formData.duration <= 0
    ) {
      setError('All fields are required and duration must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      if (selectedCourse) {
        await updateCourse(selectedCourse._id, formData);
      } else {
        await createCourse(formData);
      }
      await fetchCourses();
      handleCloseForm();
    } catch {
      setError('Failed to save course');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;

    try {
      setDeleting(true);
      await deleteCourse(selectedCourse._id);
      await fetchCourses();
      handleCloseDelete();
    } catch {
      setError('Failed to delete course');
      setDeleting(false);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Courses</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.name}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Duration: {course.duration} hours
                  </Typography>
                  <Typography variant="body2">{course.description}</Typography>
                  <Box mt={2}>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenForm(course)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpenDelete(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>{selectedCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="dense"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Description"
            margin="dense"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            fullWidth
            label="Duration (hours)"
            margin="dense"
          <TextField
            fullWidth
            label="Level"
            margin="dense"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          />
          <TextField
            fullWidth
            label="Batches"
            margin="dense"
            type="number"
            value={formData.batches}
            onChange={(e) => setFormData({ ...formData, batches: Number(e.target.value) })}
          />
        </DialogContent>
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={saving}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

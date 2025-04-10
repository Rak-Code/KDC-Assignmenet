import { ReactNode } from 'react';

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor';
  token: string;
}

export interface Batch {
  _id: string;
  name: string;
  description: string;
}

export interface Course {
  _id: string;
  name: string;
  level: string;
  description: string;
  imageUrl: string;
  batches: Batch[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Instructor {
  lectures: unknown;
  _id: string;
  name: string;
  email: string;
  expertise: string;
  imageUrl?: string;
  role: 'instructor';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInstructorDto {
  name: string;
  email: string;
  password: string;
  expertise: string;
  imageUrl?: string;
  role: 'instructor';
}

export interface Lecture {
  _id: string;
  course: string | Course;
  instructor: string | Instructor;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}

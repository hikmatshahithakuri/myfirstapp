
import { Student, Subject, User, UserRole, Section } from './types';

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', password: 'admin123', role: UserRole.ADMIN, name: 'Main Admin' },
  { id: '2', username: 'teacher1', password: 'password123', role: UserRole.TEACHER, name: 'Class Teacher' },
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: '1', code: '01', name: 'Nepali', creditHour: 2.5, fullMarksTheory: 50, fullMarksPractical: 50, passMarksTheory: 18, passMarksPractical: 18 },
  { id: '2', code: '03', name: 'English', creditHour: 2.5, fullMarksTheory: 50, fullMarksPractical: 50, passMarksTheory: 18, passMarksPractical: 18 },
  { id: '3', code: '05', name: 'Mathematics', creditHour: 2.5, fullMarksTheory: 50, fullMarksPractical: 50, passMarksTheory: 18, passMarksPractical: 18 },
  { id: '4', code: '07', name: 'Social Studies', creditHour: 2.5, fullMarksTheory: 50, fullMarksPractical: 50, passMarksTheory: 18, passMarksPractical: 18 },
  { id: '5', code: '09', name: 'Science', creditHour: 2.5, fullMarksTheory: 50, fullMarksPractical: 50, passMarksTheory: 18, passMarksPractical: 18 },
  { id: '6', code: '11', name: 'Health & Physical', creditHour: 1.5, fullMarksTheory: 50, fullMarksPractical: 50, passMarksTheory: 18, passMarksPractical: 18 },
  { id: '7', code: '13', name: 'Computer', creditHour: 2.0, fullMarksTheory: 50, fullMarksPractical: 50, passMarksTheory: 18, passMarksPractical: 18 },
];

export const INITIAL_STUDENTS: Student[] = [
  { id: '101', name: 'Subina Tamang', rollNo: '8', section: Section.A },
  { id: '102', name: 'Aarav Sharma', rollNo: '1', section: Section.A },
];


export interface GradingResult {
  grade: string;
  gradePoint: number;
  isNG: boolean;
}

export enum Section {
  A = 'A',
  B = 'B'
}

export enum Term {
  FIRST = 'First Terminal',
  SECOND = 'Second Terminal',
  FINAL = 'Final Terminal'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER'
}

export enum Conduct {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  SATISFACTORY = 'Satisfactory'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  section: Section;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  creditHour: number;
  fullMarksTheory: number;
  fullMarksPractical: number;
  passMarksTheory: number;
  passMarksPractical: number;
}

export interface Marks {
  studentId: string;
  subjectId: string;
  term: Term;
  theoryObtained: number;
  practicalObtained: number;
}

export interface TermData {
  studentId: string;
  term: Term;
  attendancePresent: number;
  attendanceTotal: number;
  conduct: Conduct;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface SubjectResult {
  subjectCode: string;
  subjectName: string;
  creditHour: number;
  theory: number;
  theoryGrade: string;
  theoryGP: number;
  practical: number;
  practicalGrade: string;
  practicalGP: number;
  finalGrade: string;
  finalGP: number;
  isNG: boolean;
}

export interface StudentReport {
  student: Student;
  term: Term;
  results: SubjectResult[];
  gpa: number;
  hasNG: boolean;
  attendancePresent: number;
  attendanceTotal: number;
  conduct: Conduct;
}

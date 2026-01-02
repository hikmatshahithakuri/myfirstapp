
import { Student, Subject, Marks, TermData, Expense, User } from '../types';
import { INITIAL_STUDENTS, INITIAL_SUBJECTS, INITIAL_USERS } from '../constants';

const KEYS = {
  STUDENTS: 'kankali_students',
  SUBJECTS: 'kankali_subjects',
  MARKS: 'kankali_marks',
  TERMDATA: 'kankali_termdata',
  EXPENSES: 'kankali_expenses',
  USERS: 'kankali_users'
};

export const StorageService = {
  getStudents: (): Student[] => {
    const data = localStorage.getItem(KEYS.STUDENTS);
    return data ? JSON.parse(data) : INITIAL_STUDENTS;
  },
  saveStudents: (data: Student[]) => localStorage.setItem(KEYS.STUDENTS, JSON.stringify(data)),

  getSubjects: (): Subject[] => {
    const data = localStorage.getItem(KEYS.SUBJECTS);
    return data ? JSON.parse(data) : INITIAL_SUBJECTS;
  },
  saveSubjects: (data: Subject[]) => localStorage.setItem(KEYS.SUBJECTS, JSON.stringify(data)),

  getMarks: (): Marks[] => {
    const data = localStorage.getItem(KEYS.MARKS);
    return data ? JSON.parse(data) : [];
  },
  saveMarks: (data: Marks[]) => localStorage.setItem(KEYS.MARKS, JSON.stringify(data)),

  getTermData: (): TermData[] => {
    const data = localStorage.getItem(KEYS.TERMDATA);
    return data ? JSON.parse(data) : [];
  },
  saveTermData: (data: TermData[]) => localStorage.setItem(KEYS.TERMDATA, JSON.stringify(data)),

  getExpenses: (): Expense[] => {
    const data = localStorage.getItem(KEYS.EXPENSES);
    return data ? JSON.parse(data) : [];
  },
  saveExpenses: (data: Expense[]) => localStorage.setItem(KEYS.EXPENSES, JSON.stringify(data)),

  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  },
  saveUsers: (data: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(data)),

  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    window.location.reload();
  }
};

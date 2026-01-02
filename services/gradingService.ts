
import { GradingResult, Subject, Marks } from '../types';

export const getGradeFromPercentage = (percentage: number): GradingResult => {
  if (percentage >= 90) return { grade: 'A+', gradePoint: 4.0, isNG: false };
  if (percentage >= 80) return { grade: 'A', gradePoint: 3.6, isNG: false };
  if (percentage >= 70) return { grade: 'B+', gradePoint: 3.2, isNG: false };
  if (percentage >= 60) return { grade: 'B', gradePoint: 2.8, isNG: false };
  if (percentage >= 50) return { grade: 'C+', gradePoint: 2.4, isNG: false };
  if (percentage >= 40) return { grade: 'C', gradePoint: 2.0, isNG: false };
  if (percentage >= 35) return { grade: 'D', gradePoint: 1.6, isNG: false };
  return { grade: 'NG', gradePoint: 0.0, isNG: true };
};

export const calculateSubjectResult = (subject: Subject, marks: Marks): any => {
  const { 
    fullMarksTheory, 
    fullMarksPractical, 
    passMarksTheory, 
    passMarksPractical 
  } = subject;
  const { theoryObtained, practicalObtained } = marks;

  const isTheoryFail = theoryObtained < passMarksTheory;
  const isPracticalFail = practicalObtained < passMarksPractical;
  const isComponentFail = isTheoryFail || isPracticalFail;

  const thPerc = (theoryObtained / fullMarksTheory) * 100;
  const prPerc = fullMarksPractical > 0 ? (practicalObtained / fullMarksPractical) * 100 : 0;
  
  const thResult = isTheoryFail ? { grade: 'NG', gradePoint: 0.0 } : getGradeFromPercentage(thPerc);
  const prResult = isPracticalFail ? { grade: 'NG', gradePoint: 0.0 } : getGradeFromPercentage(prPerc);

  const totalObtained = theoryObtained + practicalObtained;
  const totalFullMarks = fullMarksTheory + fullMarksPractical;
  const totalPerc = (totalObtained / totalFullMarks) * 100;
  
  const finalResult = isComponentFail 
    ? { grade: 'NG', gradePoint: 0.0, isNG: true } 
    : getGradeFromPercentage(totalPerc);

  return {
    subjectCode: subject.code,
    subjectName: subject.name,
    creditHour: subject.creditHour,
    theory: theoryObtained,
    theoryGrade: thResult.grade,
    theoryGP: thResult.gradePoint,
    practical: practicalObtained,
    practicalGrade: prResult.grade,
    practicalGP: prResult.gradePoint,
    finalGrade: finalResult.grade,
    finalGP: finalResult.gradePoint,
    isNG: finalResult.isNG || isComponentFail
  };
};

export const calculateGPA = (results: { finalGP: number, creditHour: number, isNG: boolean }[]): number => {
  const hasFail = results.some(r => r.isNG);
  if (hasFail) return 0.0;

  const totalGradePoints = results.reduce((acc, curr) => acc + (curr.finalGP * curr.creditHour), 0);
  const totalCreditHours = results.reduce((acc, curr) => acc + curr.creditHour, 0);

  return totalCreditHours === 0 ? 0.0 : Number((totalGradePoints / totalCreditHours).toFixed(2));
};

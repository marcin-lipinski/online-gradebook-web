import { Student } from './student';

export interface DivisionSubject {
    id: string;
    subjectName: string;
    divisionName: string;
    studentList: Student[];
    teacherName?: string;
    teacherId?: string;
}

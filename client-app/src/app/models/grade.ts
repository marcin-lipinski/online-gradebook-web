export interface Grade {
    id: string;
    gradeType: number;
    gradeWeight: number;
    studentId: string;
    subject: string;
    description: string;
    teacher: string;
}

export class GradesData {
    [key: string]: Grade[];
}

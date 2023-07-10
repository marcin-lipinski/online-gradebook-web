import { Student } from './student';
import { Subject } from './subject';

export interface Division {
    id: string;
    name: string;
    supervisingTeacherId?: string,
    supervisingTeacherName?: string,
    subject?: Subject;
    students?: Student[];
}
 
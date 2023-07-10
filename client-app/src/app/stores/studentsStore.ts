import { makeAutoObservable, runInAction } from 'mobx';
import agents from '../api/agent';
import { Student } from '../models/student';
import { v4 as uuid } from 'uuid';
import { useStore } from './store';

export default class StudentsStore {
    students: Student[] = [];
    studentsWithoutDivision: Student[] = [];
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    parentDashboardIcon = (name: string | undefined) => {
        if (!name) return;
        if (name === 'Ahmed') return '/assets/student_ah.png';
        if (name.endsWith('a')) return '/assets/student_f.png';
        return '/assets/student_m.png';
    };

    getStudentById = (studentId: string): Student | undefined => {
        return this.students.find((s) => s.id === studentId);
    };

    loadStudentByParentId = async (id: string) => {
        this.loading = true;
        try {
            const student = await agents.Students.detailed(id);
            runInAction(() => this.students = [student]);
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    };

    loadAll = async () => {
        this.loading = true;
        try {
            const _students = await agents.Students.list();
            runInAction(() => (this.students = _students));
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    };

    loadByDivisionId = async (divisionId: string) => {
        this.loading = true;
        try {
            const _students = await agents.Students.listByDivisionId( divisionId);
            runInAction(() => {
                this.students = _students;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    addStudent = async (student: Student) => {
        this.loading = true;
        student.id = uuid();
        try {
            await agents.Students.create(student);
            runInAction(() => {
                this.students.push(student);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    deleteStudent = async (studentId: string) => {
        this.loading = true;
        try {
            await agents.Students.delete(studentId);
            runInAction(() => {
                var temp = this.students.filter((x) => x.id !== studentId);
                this.students = temp;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    editStudent = async (student: Student) => {
        this.loading = true;
        try {
            await agents.Students.update(student);
            runInAction(() => {
                const t = this.students.find((x) => x.id === student.id);
                t!.name = student.name;
                t!.surname = student.surname;
                t!.divisionId = student.divisionId;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };
}

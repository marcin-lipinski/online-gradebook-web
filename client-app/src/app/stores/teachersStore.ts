import { makeAutoObservable, runInAction } from 'mobx';
import agents from '../api/agent';
import { Teacher } from '../models/teacher';
import { v4 as uuid } from 'uuid';

export default class TeachersStore {
    teachers = new Array<Teacher>();
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadAll = async () => {
        this.loading = true;
        try {
            const _teachers = await agents.Teachers.list();
            runInAction(() => {
                this.teachers = _teachers;
                this.loading = false;
            });
        } catch (error) {
            this.loading = false;
        } 
    };

    addTeacher = async (teacher: Teacher) => {
        this.loading = true;
        teacher.id = uuid();
        try {
            await agents.Teachers.create(teacher);
            runInAction(() => {
                this.teachers.push(teacher);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    deleteTeacher = async (teacherId: string) => {
        this.loading = true;
        try {
            await agents.Teachers.delete(teacherId);
            runInAction(() => {
                var temp = this.teachers.filter((x) => x.id !== teacherId);
                this.teachers = temp;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    editTeacher = async (teacher: Teacher) => {
        this.loading = true;
        try {
            await agents.Teachers.update(teacher);
            runInAction(() => {
                const t = this.teachers.find((x) => x.id === teacher.id);
                t!.name = teacher.name;
                t!.surname = teacher.surname;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };
}

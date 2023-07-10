import { makeAutoObservable, runInAction } from 'mobx';
import agents from '../api/agent';
import { Subject } from '../models/subject';
import { v4 as uuid } from 'uuid';

export default class SubjectStore {
    subjects: Subject[] = [];
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadSubjectsOfStudent = async (id: string) => {
        this.loading = true;
        try {
            const subjects = await agents.Subjects.listByStudentId(id);
            runInAction(() => (this.subjects = subjects));
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    };

    loadAll = async () => {
        this.loading = true;
        try {
            const subjects = await agents.Subjects.list();
            runInAction(() => {
                this.subjects = subjects;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    addSubject = async (subject: Subject) => {
        this.loading = true;
        subject.id = uuid();
        try {
            await agents.Subjects.create(subject);
            runInAction(() => {
                this.subjects.push(subject);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    deleteSubject = async (subjectId: string) => {
        this.loading = true;
        try {
            await agents.Subjects.delete(subjectId);
            runInAction(() => {
                const t = this.subjects.filter((x) => x.id != subjectId);
                this.subjects = t;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    editSubject = async (subject: Subject) => {
        this.loading = true;
        try {
            await agents.Subjects.update(subject);
            runInAction(() => {
                const t = this.subjects.find((x) => x.id === subject.id);
                t!.name = subject.name;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };
}

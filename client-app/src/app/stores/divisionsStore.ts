import { makeAutoObservable, runInAction } from 'mobx';
import agents from '../api/agent';
import { Division } from '../models/division';
import { store, useStore } from './store';
import { v4 as uuid } from 'uuid';
import { NewDivision } from '../../features/admin/Divisions/NewDivisionForm';

export default class DivisionsStore {
    divisions = new Array<Division>();
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadAll = async () => {
        this.loading = true;
        try {
            const _divisions = await agents.Divisions.list();
            runInAction(() => {
                this.divisions = _divisions.filter(d => d.name !== "Unassigned");
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    getDivisionName(divisionId: string | undefined): string {
        const division = this.divisions.find((d) => d.id === divisionId);
        return division ? division.name : '';
    }

    editName = async (
        division: Division,
        name: { name: string; error: null }
    ) => {
        this.loading = true;
        division.name = name.name;
        try {
            await agents.Divisions.update(division);
            const index = this.divisions.findIndex((x) => x.id === division.id);
            this.divisions[index] = division;
            this.loading = false;
        } catch (error) {
            console.log(error);
            this.loading = false;
            throw error;
        }
    };

    editSupervisor = async (
        division: Division,
        supervisor: { teacherId: string, error: null }
    ) => {
        this.loading = true;
        let teacher = store.teacherStore.teachers.find(x => x.id === supervisor.teacherId);
        division.supervisingTeacherName = teacher?.name + " " + teacher?.surname;
        division.supervisingTeacherId = supervisor.teacherId;
        try {
            await agents.Divisions.update(division);
            const index = this.divisions.findIndex((x) => x.id === division.id);
            this.divisions[index] = division;
            this.loading = false;
        } catch (error) {
            console.log(error);
            this.loading = false;
            throw error;
        }
    };

    addDivision = async (division: NewDivision) => {
        this.loading = true;
        division.id = uuid();
        try {
            await agents.Divisions.create(division);
            runInAction(() => {
                this.divisions.push(division);
                this.loading = false;
            })
        } catch(error) {
            console.log(error)
            this.loading = false;
            throw error;
        }
    }

    deleteDivision = async (divisionId: string) => {
        this.loading = true;
        try {
            await agents.Divisions.delete(divisionId);
            runInAction(() => {
                var temp = this.divisions.filter((x) => x.id !== divisionId);
                this.divisions = temp;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };
}

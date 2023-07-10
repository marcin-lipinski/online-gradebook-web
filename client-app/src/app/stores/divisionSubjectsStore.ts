import { makeAutoObservable, runInAction } from "mobx"
import agents from "../api/agent";
import { DivisionSubject } from "../models/divisonSubject";
import { v4 as uuid} from 'uuid';

export interface DivisionSubject2 {
    id: string
    subjectId: string
    subjectName: string
    teacherName: string
    teacherId: string
    divisionId: string
}

export default class DivisionSubjectsStore {
    divisionsSubject = new Array<DivisionSubject>();
    loading: boolean = false;
    subjectsByDivisionId = new Array<DivisionSubject2>();
    divisionSubjectAll = new Array<DivisionSubject2>();
    
    constructor() {
        makeAutoObservable(this);
    }

    get groupedByDivision() {
        const result = new Map<string, DivisionSubject[]>();
        this.divisionsSubject.forEach(ds => {
            if(result.has(ds.divisionName!)) result.get(ds.divisionName!)?.push(ds);
            else result.set(ds.divisionName!, [ds])
        })

        const re: [string, DivisionSubject[]][] = [];
        result.forEach((subjects, name) => {
            re.push([name, subjects]);
        });

        return re;
    }

    loadDivisionsOfTeacher = async (id: string) => {
        this.loading = true;
        try {
            const subjects = await agents.Divisions.listByTeacherId(id);
            runInAction(() => (this.divisionsSubject = subjects));
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    };

    loadSubjectsByDivisionId = async (id: string) => {
        this.loading = true;
        try{
            const subjects = await agents.DivisionSubjects.listByDivisionId(id);
            runInAction(() => {
                this.subjectsByDivisionId = subjects;
                this.loading = false;
            });
        }catch(error){
            console.log(error);
            this.loading = false;
        }
    }

    addDivisionSubject = async (ds: DivisionSubject2) => {
        this.loading = true;
        ds.id = uuid();
        try{
            await agents.DivisionSubjects.create(ds);
            runInAction(() => {
                this.subjectsByDivisionId.push(ds);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }; 

    deleteDivisionSubject = async (id: string) => {
        this.loading = true;
        try{
            await agents.DivisionSubjects.delete(id);
            runInAction(() => {
                this.subjectsByDivisionId = [...this.subjectsByDivisionId.filter(x => x.id != id)];
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    editDivisonSubject = async (ds: DivisionSubject2) => {
        this.loading = true;
        try{
            await agents.DivisionSubjects.update(ds);
            runInAction(() => {
                const temp = this.subjectsByDivisionId.findIndex(x => x.id == ds.id)
                this.subjectsByDivisionId[temp] = ds;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }
}

import { makeAutoObservable, runInAction } from 'mobx';
import agents from '../api/agent';
import { v4 as uuid } from 'uuid';
import { Parent } from '../models/parent';

export default class ParentsStore {
    parents = new Array<Parent>();
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    parentDashboardIcon = (name: string | undefined) => {
        if (!name) return;
        if (name.endsWith('a')) return '/assets/parent_f.jpg';
        return '/assets/parent_m.jpg';
    };

    loadAll = async () => {
        this.loading = true;
        try {
            const _parents = await agents.Parents.list();
            runInAction(() => {
                this.parents = _parents;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    addParent = async (parent: Parent) => {
        this.loading = true;
        parent.id = uuid();
        try {
            await agents.Parents.create(parent);
            runInAction(() => {
                this.parents.push(parent);
                this.loading = false;
            });
        } catch (error) {
            this.loading = false;
        }
    };

    deleteParent = async (parentId: string) => {
        this.loading = true;
        try {
            await agents.Parents.delete(parentId);
            runInAction(() => {
                var temp = this.parents.filter((x) => x.id !== parentId);
                this.parents = temp;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };

    editParent = async (parent: Parent) => {
        this.loading = true;
        try {
            await agents.Parents.update(parent);
            runInAction(() => {
                const t = this.parents.find((x) => x.id === parent.id);
                t!.name = parent.name;
                t!.surname = parent.surname;
                t!.studentId = parent.studentId;
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    };
}

import { makeAutoObservable, runInAction } from 'mobx';
import { UserFormValues, User } from '../models/user';
import agent from '../api/agent';
import { store } from './store';
import { router } from '../router/Routes';

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    userTypeAsString = () => {
        switch (this.user!.userType) {
            case 1:
                return 'Admin';
            case 2:
                return 'Nauczyciel';
            case 3:
                return 'Rodzic';
            case 4:
                return 'Uczeń';
        }
    };

    goToCorrectDashboard = () => {
        switch (this.user!.userType) {
            case 1:
                this.user!.userTypeText = 'Admin';
                router.navigate(`/admin`);
                break;
            case 2:
                this.user!.userTypeText = 'Nauczyciel';
                router.navigate(`/teacher`);
                break;
            case 3:
                this.user!.userTypeText = 'Rodzic';
                router.navigate(`/parent`);
                break;
            case 4:
                this.user!.userTypeText = 'Uczeń';
                router.navigate(`/student`);
                break;
        }
    };

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            runInAction(() => {
                store.commonStore.setToken(user.token);
                this.user = user;
                this.goToCorrectDashboard();
            });
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            runInAction(() => store.commonStore.setToken(user.token));
            runInAction(() => (this.user = user));
            this.goToCorrectDashboard();
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => (this.user = user));
        } catch (error) {
            console.log(error);
        }
    };
}

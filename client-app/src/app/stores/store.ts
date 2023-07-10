import { createContext, useContext } from 'react';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import UserStore from './userStore';
import GradesStore from './gradesStore';
import SubjectStore from './subjectStore';
import StudentsStore from './studentsStore';
import DivisionSubjectsStore from './divisionSubjectsStore';
import DivisionsStore from './divisionsStore';
import TeachersStore from './teachersStore';
import ParentsStore from './parentsStore';
import PaymentStore from './paymentStore';
import MenuHideStore from './menuHideStore';

interface Store {
    commonStore: CommonStore;
    modalStore: ModalStore;
    userStore: UserStore;
    gradesStore: GradesStore;
    subjectStore: SubjectStore;
    studentsStore: StudentsStore;
    divisionSubjectStore: DivisionSubjectsStore;
    divisionStore: DivisionsStore;
    teacherStore: TeachersStore;
    parentsStore: ParentsStore;
    paymentStore: PaymentStore;
    menuHideStore: MenuHideStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    userStore: new UserStore(),
    gradesStore: new GradesStore(),
    subjectStore: new SubjectStore(),
    studentsStore: new StudentsStore(),
    divisionSubjectStore: new DivisionSubjectsStore(),
    divisionStore: new DivisionsStore(),
    teacherStore: new TeachersStore(),
    parentsStore: new ParentsStore(),
    paymentStore: new PaymentStore(),
    menuHideStore: new MenuHideStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}

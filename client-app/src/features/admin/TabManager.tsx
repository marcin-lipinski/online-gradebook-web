import { useEffect } from 'react';
import { useStore } from '../../app/stores/store';
import DivisionsDashboard from './Divisions/DivisionsDashboard';
import TeachersDashboard from './Teachers/TeachersDashboard';
import SubjectsDashboard from './Subjects/SubjectsDashboard';
import ParentsDashboard from './Parents/ParentsDashboard';
import StudentsDashboard from './Students/StudentsDashboard';

interface Props {
    selectedTab: string;
}

export default function TabManager({ selectedTab }: Props) {
    const {
        subjectStore,
        studentsStore,
        divisionStore,
        teacherStore,
        parentsStore,
    } = useStore();

    useEffect(() => {
        subjectStore.loadAll();
        studentsStore.loadAll();
        divisionStore.loadAll();
        teacherStore.loadAll();
        parentsStore.loadAll();
    }, []);

    switch (selectedTab) {
        case 'teachers':
            return <TeachersDashboard />;
        case 'divisions':
            return <DivisionsDashboard />;
        case 'parents':
            return <ParentsDashboard />;
        case 'students':
            return <StudentsDashboard />;
        case 'subjects':
            return <SubjectsDashboard />;
        default:
            return <></>;
    }
}

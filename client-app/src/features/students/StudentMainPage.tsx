import { Container, Icon, Menu, Sidebar } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { router } from '../../app/router/Routes';
import NavBarHeader from '../../app/layout/NavBarHeader';
import { useState, useEffect } from 'react';
import SubjectsAndGrades from './SubjectsAndGrades';
import { observer } from 'mobx-react-lite';

export default observer(function StudentMainPage() {
    const { userStore, gradesStore, subjectStore, menuHideStore } = useStore();
    const { gradesBySubject } = gradesStore;
    const { subjects } = subjectStore;
    const [activeItem, setActiveItem] = useState('grades');

    if (userStore.user) {
        if (userStore.user.userType !== 4) router.navigate('/notfound');
    } else router.navigate('/notfound');

    useEffect(() => {
        gradesStore.loadGradesOfStudent(userStore.user!.id);
        subjectStore.loadSubjectsOfStudent(userStore.user!.id);
    }, []);  
    
    const handleItemClick = (e: any, name: string) => {
        setActiveItem(name);
    };

    return (
        <Sidebar.Pushable style={{ minHeight: '100vh', backgroundColor: 'transparent'}}>
            <Sidebar as={Menu} animation='overlay' visible={menuHideStore.state} vertical inverted fixed="left" >
                <NavBarHeader userStore={userStore} />
                    <Menu.Item
                        className="hoverable"
                        active={activeItem === 'grades'}
                        onClick={(e) => handleItemClick(e, 'grades')}
                    >
                        Oceny
                    </Menu.Item>
                    <Menu.Item
                        active={activeItem === 'logout'}
                        onClick={userStore.logout}
                    >
                        Wyloguj się
                        <Icon style={{ color: 'white' }} name="power off" />
                    </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher style={{ maxHeight: '100vh', overflowY: "auto" }}>
                <Container className="dashboardcard" style={{width: "70%", margin: "10px 0px 20px 0px", border: "none !important"}} textAlign='center' >
                        <SubjectsAndGrades
                            gradesBySubject={gradesBySubject}
                            subjects={subjects}
                        />
                </Container>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
});

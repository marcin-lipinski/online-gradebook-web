import { Container, Icon, Item, Menu, Segment, Sidebar } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { router } from '../../app/router/Routes';
import { useEffect, useState } from 'react';
import NavBarHeader from '../../app/layout/NavBarHeader';
import SubjectsAndGrades from './SubjectsAndGrades';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import BuyUniform from './BuyUniform';

export default observer(function ParentMainPage() {
    const { userStore, gradesStore, subjectStore, studentsStore, divisionStore, menuHideStore, parentsStore } =
        useStore();
    const [menuChoose, setMenuChoose] = useState('grades');
    const { gradesBySubject, loadGradesOfStudent } = gradesStore;
    const { subjects, loadSubjectsOfStudent } = subjectStore;
    const { students, parentDashboardIcon, loadStudentByParentId } = studentsStore;
    const { parents } = parentsStore;
    const { loadAll } = divisionStore;

    if (userStore.user) {
        if (userStore.user.userType !== 3) router.navigate('/notfound');
    } else router.navigate('/notfound');

    useEffect(() => {
        loadAll();
        if (students.length === 0) {
            parentsStore.loadAll();
        }
        if (
            parents.find((p) => p.id === userStore.user!.id)?.studentId !== null &&
            (students.length === 0 ||
                students.at(0)!.id !== parents.find((p) => p.id === userStore.user!.id)?.studentId)
        ) {
            loadStudentByParentId(userStore.user!.id);
        }
        if (students.length !== 0) {
            loadSubjectsOfStudent(students.at(0)!.id);
            loadGradesOfStudent(students.at(0)!.id);
        }
    }, [students, loadStudentByParentId, loadAll, loadGradesOfStudent, loadSubjectsOfStudent, userStore.user]);

    const [activeItem, setActiveItem] = useState('grades');
    const handleItemClick = (e: any, name: string) => {
        setActiveItem(name);
        setMenuChoose(name);
    };

    if (studentsStore.loading || gradesStore.loading || subjectStore.loading)
        return <LoadingComponent content={'Ładuję oceny..'} />;

    return (
        <>
            <Sidebar.Pushable style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
                <Sidebar as={Menu} animation="overlay" visible={menuHideStore.state} vertical inverted fixed="left">
                    <NavBarHeader userStore={userStore} />
                    <Menu.Item
                        className="hoverable"
                        active={activeItem === 'grades'}
                        onClick={(e) => handleItemClick(e, 'grades')}
                    >
                        Oceny
                    </Menu.Item>
                    <Menu.Item
                        className="hoverable"
                        active={activeItem === 'uniform'}
                        onClick={(e) => handleItemClick(e, 'uniform')}
                    >
                        Mundurki
                    </Menu.Item>
                    <Menu.Item active={activeItem === 'logout'} onClick={userStore.logout}>
                        Wyloguj się
                        <Icon style={{ color: 'white' }} name="power off" />
                    </Menu.Item>
                </Sidebar>

                <Sidebar.Pusher style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                    <Container
                        className="dashboardcard"
                        style={{ width: '70%', margin: '10px 0px 20px 0px', border: 'none !important' }}
                        textAlign="center"
                    >
                        <Segment textAlign="left" basic style={{ border: 'none' }}>
                            <Item.Group>
                                <Item>
                                    <Item.Image size="tiny" src={parentDashboardIcon(students.at(0)?.name)} />
                                    <Item.Content>
                                        <Item.Header>
                                            {`Uczeń: ${students.at(0)?.name + ' ' + students.at(0)?.surname}`}
                                        </Item.Header>
                                        <Item.Meta>
                                            {`Klasa: ${divisionStore.getDivisionName(students.at(0)?.divisionId)}`}
                                        </Item.Meta>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Segment>
                    </Container>
                    <Container className="dashboardcard" style={{ width: '70%' }}>
                        {menuChoose === 'grades' ? (
                            <SubjectsAndGrades gradesBySubject={gradesBySubject} subjects={subjects} />
                        ) : (
                            <BuyUniform />
                        )}
                    </Container>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </>
    );
});

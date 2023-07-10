import { Container, Header, Icon, Menu, Sidebar, Table } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { router } from '../../app/router/Routes';
import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import NavBarHeader from '../../app/layout/NavBarHeader';
import { DivisionSubject } from '../../app/models/divisonSubject';
import StudentTable from './StudentTable';

export default observer(function TeacherMainPage() {
    const { userStore, divisionSubjectStore: divisionStore} = useStore();
    const [menuChoose, setMenuChoose] = useState('divisions');
    const [divisionSubject, setDivisionSubject] = useState<DivisionSubject>();
    const { loadDivisionsOfTeacher } = divisionStore;
    const [activeItem, setActiveItem] = useState('divisions');
    const { userStore: { user }, menuHideStore } = useStore();

    if (user) {
        if (user.userType !== 2) router.navigate('/notfound');
    } else router.navigate('/notfound');
    
    const handleItemClick = (name: string) => {
        setActiveItem(name);
        setMenuChoose(name);
    };

    const handleDevisionSubjectClick = (ds: DivisionSubject) => {
        setMenuChoose('klasa');
        setDivisionSubject(ds);
    };

    useEffect(() => {
        loadDivisionsOfTeacher(user!.id);
    }, [loadDivisionsOfTeacher, user]);

    if (divisionStore.loading) return <LoadingComponent content={'Ładuję klasy..'} />;

    return (
        <Sidebar.Pushable style={{ minHeight: '100vh', backgroundColor: 'transparent', height: '100vh'}}>
            <Sidebar as={Menu} animation='overlay' visible={menuHideStore.state} vertical inverted fixed="left" >
                <NavBarHeader userStore={userStore} />
                    <Menu.Item
                        className="hoverable"
                        active={activeItem === 'divisions'}
                        onClick={() => handleItemClick('grades')}
                    >
                        Klasy
                    </Menu.Item>
                    <Menu.Item
                        className="hoverable"
                        active={activeItem === 'logout'}
                        onClick={userStore.logout}
                    >
                        Wyloguj się
                        <Icon style={{ color: 'white' }} name="power off" />
                    </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher style={{ maxHeight: '100vh', overflowY: "auto" }}>
                <Container className="dashboardcard" style={{width: "70%", margin: "10px 0px 20px 0px", border: "none !important"}} textAlign='left' >
                    {menuChoose === 'divisions' ? (
                            <Table striped celled>
                                <Table.Body>
                                <Table.Row >
                                    <Table.Cell width={2} textAlign='center'>
                                        <Header content="Klasa" as = "h3"/>
                                    </Table.Cell>
                                    <Table.Cell textAlign='center'>
                                        <Header content="Przedmioty" as = "h3"/>
                                    </Table.Cell>
                                </Table.Row>
                                {divisionStore.groupedByDivision.map((division, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell textAlign='center'>
                                            <Header content={division[0]} as = "h4"/>
                                        </Table.Cell>
                                        <Table.Cell textAlign='center' style={{padding: "5px"}}>
                                            {division[1].map((ds, index) => (
                                                <Header key={index} as="h4" style={{margin: "5px 0px 5px 0px", cursor: 'pointer', color: "rgb(64, 95, 194)"}} onClick={() => handleDevisionSubjectClick(ds)} content={ds.subjectName}/>
                                            ))}
                                        </Table.Cell>
                                    </Table.Row>
                                ))} 
                                </Table.Body>    
                            </Table>
                        ) : (
                            <>
                                <StudentTable
                                    divisionSubject={divisionSubject}
                                    handleItemClick={handleItemClick}
                                />
                            </>
                        )}
                </Container>
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    );
});

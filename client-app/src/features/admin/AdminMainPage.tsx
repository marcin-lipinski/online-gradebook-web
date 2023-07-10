import { Container, Menu, Sidebar } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { router } from '../../app/router/Routes';
import {useState } from 'react';
import NavBarHeader from '../../app/layout/NavBarHeader';
import TabManager from './TabManager';
import { observer } from 'mobx-react-lite';

export default observer(function AdminMainPage() {
    const { userStore, menuHideStore } = useStore();

    if (userStore.user) {
        if (userStore.user.userType !== 1) router.navigate('/notfound');
    } else router.navigate('/notfound');

    const [activeItem, setActiveItem] = useState('students');
    const handleItemClick = (e: any, { name }: { name: string }) => {
        setActiveItem(name);
    };

    return (
        <Sidebar.Pushable style={{ minHeight: '100vh', backgroundColor: 'transparent'}}>
            <Sidebar as={Menu} animation='overlay' visible={menuHideStore.state} vertical inverted fixed="left" >
                <NavBarHeader userStore={userStore} />
                <Menu.Item
                    name="Uczniowie"
                    active={activeItem === 'students'}
                    onClick={(e) => handleItemClick(e, { name: 'students' })}
                    style={{ backgroundColor: 'rgba(75, 106, 204,.50)' }}
                />
                <Menu.Item
                    name="Rodzice"
                    active={activeItem === 'parents'}
                    onClick={(e) => handleItemClick(e, { name: 'parents' })}
                    style={{ backgroundColor: 'rgba(75, 106, 204,.50)'}}
                />
                <Menu.Item
                    name="Klasy"
                    active={activeItem === 'divisions'}
                    onClick={(e) => handleItemClick(e, { name: 'divisions' })}
                    style={{ backgroundColor: 'rgba(75, 106, 204,.50)' }}
                />
                <Menu.Item
                    name="Nauczyciele"
                    active={activeItem === 'teachers'}
                    onClick={(e) => handleItemClick(e, { name: 'teachers' })}
                    style={{ backgroundColor: 'rgba(75, 106, 204,.50)'}}
                />
                <Menu.Item
                    name="Przedmioty"
                    active={activeItem === 'subjects'}
                    onClick={(e) => handleItemClick(e, { name: 'subjects' })}
                    style={{ backgroundColor: 'rgba(75, 106, 204,.50)'}}
                />
                <Menu.Item
                    active={activeItem === 'logout'}
                    onClick={userStore.logout}
                    content="Wyloguj się"
                    style={{backgroundColor: 'rgba(75, 106, 204, .50)'}}
                />
            </Sidebar>

            <Sidebar.Pusher style={{ maxHeight: '100vh', height: "100vh", overflowY: "auto" }} >
                <Container className="dashboardcard" style={{width: "70%", margin: "10px 0px 20px 0px", border: "none !important"}} >
                    <TabManager selectedTab={activeItem} />
                </Container>
            </Sidebar.Pusher>
        </Sidebar.Pushable>                   
    );
})

import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import { useEffect } from 'react';
import ModalContainer from '../common/ModalContainer';
import MenuButton from './MenuButton';

function App() {
    const location = useLocation();
    const { commonStore, userStore } = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, useStore]);

    if (!commonStore.appLoaded)
        return <LoadingComponent content="Ładowanie dziennika..." />;

    return (
        <>
            <ModalContainer/>
            <ToastContainer
                position="bottom-right"
                hideProgressBar
                theme="colored"
            />
            {location.pathname === '/' ? (
                <HomePage />
            ) : (
                <>
                    <Outlet/>
                    <MenuButton/>
                </>
            )}
        </>
    );
}

export default observer(App);
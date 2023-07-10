import { RouteObject, createBrowserRouter } from 'react-router-dom';
import App from '../layout/App';
import AdminMainPage from '../../features/admin/AdminMainPage';
import TeacherMainPage from '../../features/teacher/TeacherMainPage';
import ParentMainPage from '../../features/parent/ParentMainPage';
import StudentMainPage from '../../features/students/StudentMainPage';
import NotFound from '../layout/NotFound';
import SomethingWentWrong from '../layout/SomethingWentWrong';
import NotifyAfterPayment from '../layout/NotifyAfterPayment';

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/admin', element: <AdminMainPage /> },
            { path: '/teacher', element: <TeacherMainPage /> },
            { path: '/parent', element: <ParentMainPage /> },
            { path: '/student', element: <StudentMainPage /> },
            { path: '/parent/notify', element: <NotifyAfterPayment /> },
            { path: '/somethingwentwrong', element: <SomethingWentWrong /> },            
            { path: '*', element: <NotFound /> },
        ],
    },
];

export const router = createBrowserRouter(routes);

import { createBrowserRouter, Navigate } from 'react-router';
import MissionCreate from './views/MissionCreate';
import MissionsScreen from './views/missions';
import Navbar from './views/navbar';
import Settings from './views/Settings';
import Treatment from './views/treatment';

export const ROUTES = {
    settings: '/settings',
    new: '/new',
    missions: '/missions',
    treatment: '/treatment',
};

export const BROWSER_ROUTER = createBrowserRouter([
    {
        Component: Navbar,
        children: [
            {
                path: ROUTES.settings,
                Component: Settings,
            },
            {
                path: ROUTES.new,
                Component: MissionCreate,
            },
            {
                path: ROUTES.missions,
                Component: MissionsScreen,
            },
            {
                path: ROUTES.treatment,
                Component: Treatment,
            },
            {
                path: '*',
                element: (<Navigate to={ROUTES.missions} replace />),
            },
        ],
    },
]);

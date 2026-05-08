import { createBrowserRouter, Navigate } from 'react-router';
import { ROUTES } from './constants';
import MissionCreate from './views/MissionCreate';
import MissionsScreen from './views/missions';
import Navbar from './views/navbar';
import Settings from './views/Settings';
import Treatment, { Media, Plan, Table } from './views/treatment';

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
        ],
    },
    {
        path: ROUTES.media,
        Component: Media,
    },
    {
        path: ROUTES.table,
        Component: Table,
    },
    {
        path: ROUTES.plan,
        Component: Plan,
    },
    {
        path: '*',
        element: (<Navigate to={ROUTES.missions} replace />),
    },
]);

import { createBrowserRouter, Navigate } from 'react-router';
import Drawer from './views/Drawer';
import MissionCreate from './views/MissionCreate';
import MissionsScreen from './views/missions/MissionsScreen';
import Settings from './views/Settings';

export const PATH_MISSION_CREATE = '/new';
export const PATH_MISSIONS = '/missions';
export const PATH_SETTINGS = '/settings';

export const BROWSER_ROUTER = createBrowserRouter([
    {
        Component: Drawer,
        children: [
            {
                path: PATH_MISSION_CREATE,
                Component: MissionCreate,
            },
            {
                path: PATH_MISSIONS,
                Component: MissionsScreen,
            },
            {
                path: PATH_SETTINGS,
                Component: Settings,
            },
            {
                path: '*',
                element: (<Navigate to={PATH_MISSIONS} replace />),
            },
        ],
    },
]);

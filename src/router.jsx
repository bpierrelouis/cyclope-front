import { createBrowserRouter, Navigate } from 'react-router';
import { ROUTES } from './constants';
import { Drawer, Media, MissionListScreen, NewScreen, Plan, SettingsScreen, Table, TreatmentScreen } from './views';

export const BROWSER_ROUTER = createBrowserRouter([
    {
        Component: Drawer,
        children: [
            {
                path: ROUTES.settings,
                Component: SettingsScreen,
            },
            {
                path: ROUTES.new,
                Component: NewScreen,
            },
            {
                path: ROUTES.missionList,
                Component: MissionListScreen,
            },
            {
                path: ROUTES.treatment,
                Component: TreatmentScreen,
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
        element: (<Navigate to={ROUTES.missionList} replace />),
    },
]);

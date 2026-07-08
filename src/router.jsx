import { createBrowserRouter, Navigate } from 'react-router';
import { ERoute } from './constants';
import { Drawer, Media, MissionListScreen, NewScreen, Plan, SettingsScreen, Table, TreatmentScreen } from './views';

export const BROWSER_ROUTER = createBrowserRouter([
    {
        Component: Drawer,
        children: [
            {
                path: ERoute.SETTINGS,
                Component: SettingsScreen,
            },
            {
                path: ERoute.NEW,
                Component: NewScreen,
            },
            {
                path: ERoute.MISSION_LIST,
                Component: MissionListScreen,
            },
            {
                path: ERoute.TREATMENT,
                Component: TreatmentScreen,
            },
        ],
    },
    {
        path: ERoute.MEDIA,
        Component: Media,
    },
    {
        path: ERoute.TABLE,
        Component: Table,
    },
    {
        path: ERoute.PLAN,
        Component: Plan,
    },
    {
        path: '*',
        element: (<Navigate to={ERoute.MISSION_LIST} replace />),
    },
]);

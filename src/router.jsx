import { createBrowserRouter, Navigate } from 'react-router';

import { ERoute } from './constants';
import { Drawer, Media, MissionListScreen, NewScreen, Plan, SettingsScreen, Table, TreatmentScreen } from './views';

export const BROWSER_ROUTER = createBrowserRouter([
    {
        children: [
            {
                Component: SettingsScreen,
                path: ERoute.SETTINGS,
            },
            {
                Component: NewScreen,
                path: ERoute.NEW,
            },
            {
                Component: MissionListScreen,
                path: ERoute.MISSION_LIST,
            },
            {
                Component: TreatmentScreen,
                path: ERoute.TREATMENT,
            },
        ],
        Component: Drawer,
    },
    {
        Component: Media,
        path: ERoute.MEDIA,
    },
    {
        Component: Table,
        path: ERoute.TABLE,
    },
    {
        Component: Plan,
        path: ERoute.PLAN,
    },
    {
        element: (<Navigate to={ERoute.MISSION_LIST} replace />),
        path: '*',
    },
]);

import { Navigate, useRoutes } from 'react-router';

import { AsyncView, DetachedViewer } from './components';
import { ERoute } from './constants';
import { lazyNamedExport } from './utils';
import { Drawer, LazyPlan, LazyTable, Media, MissionListScreen } from './views';

const LazyNewScreen = lazyNamedExport(
    () => import('./views/new/NewScreen'),
    'NewScreen',
);
const LazySettingsScreen = lazyNamedExport(
    () => import('./views/settings/SettingsScreen'),
    'SettingsScreen',
);
const LazyTreatmentScreen = lazyNamedExport(
    () => import('./views/treatment/TreatmentScreen'),
    'TreatmentScreen',
);

const routes = [
    {
        children: [
            {
                element: <AsyncView><LazySettingsScreen /></AsyncView>,
                path: ERoute.SETTINGS,
            },
            {
                element: <AsyncView><LazyNewScreen /></AsyncView>,
                path: ERoute.NEW,
            },
            {
                Component: MissionListScreen,
                path: ERoute.MISSION_LIST,
            },
            {
                element: (
                    <div className='flex h-screen'>
                        <AsyncView><LazyTreatmentScreen /></AsyncView>
                    </div>
                ),
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
        element: (
            <DetachedViewer>
                <AsyncView><LazyTable /></AsyncView>
            </DetachedViewer>
        ),
        path: ERoute.TABLE,
    },
    {
        element: (
            <DetachedViewer>
                <AsyncView><LazyPlan /></AsyncView>
            </DetachedViewer>
        ),
        path: ERoute.PLAN,
    },
    {
        element: (<Navigate to={ERoute.MISSION_LIST} replace />),
        path: '*',
    },
];

export function AppRouter() {
    return useRoutes(routes);
}

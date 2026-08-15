import { createBrowserRouter, Navigate } from 'react-router';

import { AsyncView } from './components';
import { ERoute } from './constants';
import { lazyNamedExport } from './utils';
import { Drawer } from './views/layouts';
import { MissionListScreen } from './views/missionList';
import { LazyPlan, LazyTable } from './views/treatment/LazyViewerViews';
import { Media } from './views/treatment/Media';

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

const NewScreen = () => <AsyncView><LazyNewScreen /></AsyncView>;
const SettingsScreen = () => <AsyncView><LazySettingsScreen /></AsyncView>;
const TreatmentScreen = () => (
    <div className='flex h-screen'>
        <AsyncView><LazyTreatmentScreen /></AsyncView>
    </div>
);

const PlanScreen = () => (
    <DetachedViewer>
        <AsyncView>
            <LazyPlan />
        </AsyncView>
    </DetachedViewer>
);

const TableScreen = () => (
    <DetachedViewer>
        <AsyncView>
            <LazyTable />
        </AsyncView>
    </DetachedViewer>
);

const DetachedViewer = ({ children }) => (
    <main className='flex bg-base-300 w-full h-screen'>
        {children}
    </main>
);

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
        Component: TableScreen,
        path: ERoute.TABLE,
    },
    {
        Component: PlanScreen,
        path: ERoute.PLAN,
    },
    {
        element: (<Navigate to={ERoute.MISSION_LIST} replace />),
        path: '*',
    },
]);

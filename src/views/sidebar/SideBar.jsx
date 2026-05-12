import { CogIcon, FoldersIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PlusIcon } from 'lucide-react';
import { ROUTES } from '../../constants';
import { MediaList } from './MediaList';
import { NavItem } from './NavItem';
import { ThemeSwap } from './ThemeSwap';

export function SideBar(props) {
    return (
        <aside className='flex flex-col items-stretch bg-base-100 px-2 py-4 w-fit is-drawer-open:w-64 min-h-full is-drawer-close:overflow-visible drawer-side'>
            <div className='flex items-center'>
                <label htmlFor={props.drawerId} aria-label='open sidebar' className='btn btn-ghost'>
                    <PanelLeftCloseIcon className='is-drawer-close:hidden' />
                    <PanelLeftOpenIcon className='is-drawer-open:hidden' />
                </label>
                <h1 className='is-drawer-close:hidden text-xl text-center grow'>Cyclope</h1>
                <ThemeSwap />
            </div>
            <div className='divider'></div>
            <NavItem
                title='Nouveau'
                Icon={PlusIcon}
                to={ROUTES.new} />
            <NavItem
                title='Missions'
                Icon={FoldersIcon}
                to={ROUTES.missionList} />
            <NavItem
                title='Paramètres'
                Icon={CogIcon}
                to={ROUTES.settings} />
            <MediaList />
        </aside>
    );
}

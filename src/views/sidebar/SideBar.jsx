import { CogIcon, FoldersIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PlusIcon } from 'lucide-react';

import { ERoute } from '../../constants';
import { Health } from './Health';
import { MediaList } from './MediaList';
import { NavItem } from './NavItem';
import { ThemeSwap } from './ThemeSwap';

export function SideBar(props) {
    return (
        <aside className='flex flex-col items-stretch bg-base-100 border-base-300 border-r w-fit is-drawer-open:w-xs min-h-full is-drawer-close:overflow-visible drawer-side'>
            <div className='flex items-center px-2 pt-5'>
                <label htmlFor={props.drawerId} aria-label='open sidebar' className='btn btn-ghost'>
                    <PanelLeftCloseIcon className='is-drawer-close:hidden' />
                    <PanelLeftOpenIcon className='is-drawer-open:hidden' />
                </label>
                <h1 className='is-drawer-close:hidden font-bold text-primary text-xl text-center uppercase tracking-[0.25em] grow'>Cyclope</h1>
                <ThemeSwap />
            </div>
            <div className='divider'></div>
            <ul className='px-2 w-full menu'>
                <NavItem title='Nouveau' to={ERoute.NEW}>
                    <PlusIcon />
                </NavItem>
                <NavItem title='Missions' to={ERoute.MISSION_LIST}>
                    <FoldersIcon />
                </NavItem>
                <NavItem title='Paramètres' to={ERoute.SETTINGS}>
                    <CogIcon />
                </NavItem>
            </ul>
            <div className='divider'></div>
            <ul className='flex-nowrap px-2 w-full overflow-auto menu grow'>
                <MediaList />
            </ul>
            <div className='divider'></div>
            <div className='flex flex-col self-left mb-4 pl-8 font-medium text-sm'>
                <Health />
            </div>
        </aside>
    );
}

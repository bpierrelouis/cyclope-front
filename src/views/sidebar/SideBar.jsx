import { CogIcon, FoldersIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PlusIcon } from 'lucide-react';
import { ERoute } from '../../constants';
import { Health } from './Health';
import { MediaList } from './MediaList';
import { NavItem } from './NavItem';
import { ThemeSwap } from './ThemeSwap';

export function SideBar(props) {
    return (
        <aside className='flex flex-col items-stretch bg-base-100 w-fit is-drawer-open:w-xs min-h-full is-drawer-close:overflow-visible drawer-side'>
            <div className='flex items-center px-2 border-b border-(--p-20) h-[54px]'>
                <label htmlFor={props.drawerId} aria-label='open sidebar' className='btn btn-ghost'>
                    <PanelLeftCloseIcon className='is-drawer-close:hidden' />
                    <PanelLeftOpenIcon className='is-drawer-open:hidden' />
                </label>
                <h1 className='is-drawer-close:hidden text-xl text-center grow'>Cyclope</h1>
                <ThemeSwap />
            </div>
            <div className='flex flex-col grow px-2 py-4'>
                <NavItem title='Nouveau' to={ERoute.NEW}>
                    <PlusIcon />
                </NavItem>
                <NavItem title='Missions' to={ERoute.MISSION_LIST}>
                    <FoldersIcon />
                </NavItem>
                <NavItem title='Paramètres' to={ERoute.SETTINGS}>
                    <CogIcon />
                </NavItem>
                <MediaList />
                <div className='mt-auto divider'></div>
                <div className='flex flex-col self-left px-4 font-mono font-medium text-sm'>
                    <Health />
                </div>
            </div>
        </aside>
    );
}
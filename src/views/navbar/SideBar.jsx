import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, RectangleStackIcon, SettingsIcon } from '../../assets/icons';
import { ROUTES } from '../../router';
import Medias from './Medias';
import NavItem from './NavItem';
import ThemeSwap from './ThemeSwap';

export default function SideBar(props) {
    return (
        <aside className='flex flex-col items-stretch bg-base-100 px-2 py-4 w-fit is-drawer-open:w-64 min-h-full is-drawer-close:overflow-visible drawer-side'>
            <div className='flex items-center'>
                <ThemeSwap />
                <h1 className='is-drawer-close:hidden text-xl text-center grow'>Cyclope</h1>
                <label htmlFor={props.drawerId} aria-label='open sidebar' className='btn btn-ghost'>
                    <ChevronLeftIcon className='is-drawer-close:hidden size-5' />
                    <ChevronRightIcon className='is-drawer-open:hidden size-5' />
                </label>
            </div>
            <div className='divider'></div>
            <NavItem
                title='Nouveau'
                Icon={PlusIcon}
                to={ROUTES.new} />
            <NavItem
                title='Missions'
                Icon={RectangleStackIcon}
                to={ROUTES.missions} />
            <NavItem
                title='Paramètres'
                Icon={SettingsIcon}
                to={ROUTES.settings} />
            <Medias />
        </aside>
    );
}

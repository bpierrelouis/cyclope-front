import { NavLink, Outlet } from 'react-router';
import { ChevronLeftIcon, ChevronRightIcon, MoonIcon, PlusIcon, RectangleStackIcon, SettingsIcon, SunIcon } from '../assets/icons';
import { PATH_MISSION_CREATE, PATH_MISSION_LIST, PATH_SETTINGS } from '../router';

export default function Drawer() {
    const drawerId = 'my-drawer';
    return (
        <div className='drawer lg:drawer-open'>
            <input id={drawerId} type='checkbox' className='drawer-toggle' />
            <div className='drawer-content bg-base-200'>
                <Outlet />
            </div>
            <SideBar drawerId={drawerId} />
        </div>
    );
}

function SideBar(props) {
    return (
        <aside className='drawer-side flex flex-col items-stretch min-h-full w-fit px-2 py-4 bg-base-100 is-drawer-close:overflow-visible is-drawer-open:w-64'>
            <div className='flex items-center'>
                <ThemeSwap />
                <h1 className='grow text-xl text-center is-drawer-close:hidden'>Cyclope</h1>
                <label htmlFor={props.drawerId} aria-label='open sidebar' className='btn btn-ghost'>
                    <ChevronLeftIcon className='size-5 is-drawer-close:hidden' />
                    <ChevronRightIcon className='size-5 is-drawer-open:hidden' />
                </label>
            </div>
            <div className='divider'></div>
            <NavItem
                title='Nouveau'
                Icon={PlusIcon}
                to={PATH_MISSION_CREATE}
            />
            <NavItem
                title='Missions'
                Icon={RectangleStackIcon}
                to={PATH_MISSION_LIST}
            />
            <NavItem
                title='Paramètres'
                Icon={SettingsIcon}
                to={PATH_SETTINGS}
            />
        </aside>
    );
}

function ThemeSwap() {
    return (
        <label className='swap swap-rotate btn btn-ghost is-drawer-close:hidden'>
            <input type='checkbox' className='theme-controller' value='dark' />
            <SunIcon className='swap-off size-5' />
            <MoonIcon className='swap-on size-5' />
        </label>
    );
}

function NavItem(props) {
    return (
        <NavLink
            to={props.to}
            className={({ isActive }) => {
                const base = 'is-drawer-close:tooltip is-drawer-close:tooltip-right btn flex justify-start';
                return [
                    base,
                    isActive ? 'btn-soft btn-primary' : 'btn-ghost',
                ].join(' ');
            }}
            data-tip={props.title}
        >
            {props.Icon({ className: 'size-5' })}
            <span className='is-drawer-close:hidden'>{props.title}</span>
        </NavLink>
    );
} 

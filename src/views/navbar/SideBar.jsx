import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, RectangleStackIcon, SettingsIcon } from '../../assets/icons';
import { PATH_MISSION_CREATE, PATH_MISSIONS, PATH_SETTINGS } from '../../router';
import NavItem from './NavItem';
import ThemeSwap from './ThemeSwap';

export default function SideBar(props) {
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
                to={PATH_MISSION_CREATE} />
            <NavItem
                title='Missions'
                Icon={RectangleStackIcon}
                to={PATH_MISSIONS} />
            <NavItem
                title='Paramètres'
                Icon={SettingsIcon}
                to={PATH_SETTINGS} />
            {/* <div className='divider'></div>
            <span className='text-sm opacity-50 is-drawer-close:hidden'>{mockMission.name}</span>
            {mockMission.medias.map((m) => (
                <NavItem
                    key={m.id}
                    title={m.name}
                    Icon={m.isVideo ? PlayCircleIcon : PhotoIcon}
                    to={`${PATH_MISSION_LIST}/${mockMission.id}/medias/${m.id}`}
                />
            ))} */}
        </aside>
    );
}

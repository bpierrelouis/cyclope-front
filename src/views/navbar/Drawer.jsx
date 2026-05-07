import { Outlet } from 'react-router';
import SideBar from './SideBar';

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

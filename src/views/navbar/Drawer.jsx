import { Outlet } from 'react-router';
import SideBar from './SideBar';

export default function Drawer() {
    const drawerId = 'my-drawer';
    return (
        <div className='drawer lg:drawer-open'>
            <input
                id={drawerId}
                type='checkbox'
                className='drawer-toggle'
                defaultChecked
            />
            <div className='bg-base-200 drawer-content'>
                <Outlet />
            </div>
            <SideBar drawerId={drawerId} />
        </div>
    );
}

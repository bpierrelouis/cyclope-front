import { Outlet } from 'react-router';

import { SideBar } from '../sidebar';

export function Drawer() {
    const drawerId = 'my-drawer';
    return (
        <div className='h-screen overflow-hidden drawer drawer-open'>
            <input
                id={drawerId}
                type='checkbox'
                className='drawer-toggle'
                defaultChecked
            />
            <div className='bg-base-200 min-w-0 min-h-0 overflow-hidden drawer-content'>
                <Outlet />
            </div>
            <SideBar drawerId={drawerId} />
        </div>
    );
}

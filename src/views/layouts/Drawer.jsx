import { Outlet } from 'react-router';

import { SelectionProvider } from '../../contexts';
import { SideBar } from '../sidebar';

export function Drawer() {
    const drawerId = 'my-drawer';
    return (
        <SelectionProvider>
            <div className='drawer drawer-open'>
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
        </SelectionProvider>
    );
}

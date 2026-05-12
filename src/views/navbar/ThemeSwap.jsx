import { SunMoonIcon } from 'lucide-react';

export default function ThemeSwap() {
    return (
        <label className='is-drawer-close:hidden btn btn-ghost'>
            <input
                type='checkbox'
                className='hidden theme-controller'
                value='dark'
            />
            <SunMoonIcon />
        </label>
    );
}

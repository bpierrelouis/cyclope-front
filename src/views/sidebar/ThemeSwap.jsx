import { SunMoonIcon } from 'lucide-react';
import { useThemeStore } from '../../stores';

export function ThemeSwap() {
    const { isDark, toggle } = useThemeStore();

    return (
        <label className='is-drawer-close:hidden btn btn-ghost'>
            <input
                type='checkbox'
                className='hidden theme-controller'
                value='dark'
                checked={isDark}
                onChange={toggle}
            />
            <SunMoonIcon />
        </label>
    );
}

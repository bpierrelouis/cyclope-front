import { SunMoonIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useThemeStore } from '../../stores';

export function ThemeSwap() {
    const { isDark, toggle } = useThemeStore(useShallow((state) => ({
        isDark: state.isDark,
        toggle: state.toggle,
    })));

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

import { MoonIcon, SunIcon } from '../../assets/icons';

export default function ThemeSwap() {
    return (
        <label className='swap swap-rotate btn btn-ghost is-drawer-close:hidden'>
            <input type='checkbox' className='theme-controller' value='dark' />
            <SunIcon className='swap-off size-5' />
            <MoonIcon className='swap-on size-5' />
        </label>
    );
}

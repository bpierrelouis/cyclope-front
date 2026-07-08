import { NavLink } from 'react-router';
import { cn } from '../../utils';

export function NavItem(props) {
    return (
        <NavLink
            to={props.to}
            className={({ isActive }) => (cn(
                'is-drawer-close:tooltip-right flex justify-start is-drawer-close:tooltip btn btn-ghost',
                (props.isActive ?? isActive) && 'not-hover:btn-soft not-hover:btn-primary',
            ))}
            data-tip={props.title}
        >
            {props.children}
            <span className='is-drawer-close:hidden'>{props.title}</span>
            {props.badges && (
                <span className='is-drawer-close:hidden flex items-center gap-1 ml-auto'>
                    {props.badges}
                </span>
            )}
        </NavLink>
    );
}

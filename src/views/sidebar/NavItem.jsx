import { NavLink } from 'react-router';
import { cn } from '../../utils';

export function NavItem(props) {
    return (
        <li>
            <NavLink
                to={props.to}
                className={({ isActive }) => (cn(
                    'is-drawer-close:tooltip-right is-drawer-close:tooltip',
                    (props.isActive ?? isActive) && 'menu-active',
                ))}
                data-tip={props.title}
            >
                {props.children}
                <span className='is-drawer-close:hidden overflow-hidden text-ellipsis'>{props.title}</span>
            </NavLink>
        </li>
    );
}

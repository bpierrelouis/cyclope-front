import { NavLink } from 'react-router';

export default function NavItem(props) {
    return (
        <NavLink
            to={props.to}
            className={({ isActive }) => {
                const base = 'is-drawer-close:tooltip is-drawer-close:tooltip-right btn flex justify-start btn-ghost';
                return [
                    base,
                    props.isActive ?? isActive ? 'not-hover:btn-soft not-hover:btn-primary' : '',
                ].join(' ').trim();
            }}
            data-tip={props.title}
        >
            {props.Icon({ className: 'size-5' })}
            <span className='is-drawer-close:hidden'>{props.title}</span>
        </NavLink>
    );
}

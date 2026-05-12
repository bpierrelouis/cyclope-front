export function SquareButton(props) {
    return (
        <button
            className={`btn-ghost btn btn-square tooltip ${props.className}`}
            onClick={props.onClick}
            data-tip={props.label}
        >
            {props.children}
        </button>
    );
}

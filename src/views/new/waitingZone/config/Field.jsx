export function Field(props) {
    return (
        <label className='flex justify-between items-center gap-2'>
            <span className='flex-1 text-sm text-base-content/70'>{props.label}</span>
            {props.children}
        </label>
    );
}

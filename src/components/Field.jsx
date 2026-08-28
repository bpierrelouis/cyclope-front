export function Field(props) {
    return (
        <label className='justify-between gap-2 w-full fieldset-label'>
            <span className='flex-1'>{props.label}</span>
            {props.children}
        </label>
    );
}

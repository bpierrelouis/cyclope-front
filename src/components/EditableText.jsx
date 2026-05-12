import { useEffect, useRef, useState } from 'react';
import { preventDefault } from '../utils';

export function EditableText(props) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(props.value);
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const save = () => {
        props.setValue(value);
        setEditing(false);
    };

    return (
        <div>
            {editing ? (
                <input
                    ref={inputRef}
                    type='text'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={save}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            save();
                        }
                    }}
                />
            ) : (
                <button
                    onClick={preventDefault(() => setEditing(true))}
                    className='cursor-text'
                >
                    {value}
                </button>
            )}
        </div>
    );
}
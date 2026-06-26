import { XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export function Toast(props) {
    const { t, message, type } = props;
    return (
        <div
            className={`block relative overflow-hidden alert ${type}`}
        >
            <button
                className='float-end ml-2 btn btn-ghost btn-xs btn-circle'
                onClick={() => toast.dismiss(t.id)}
            >
                <XIcon />
            </button>
            <span>{message}</span>
        </div>
    );
}

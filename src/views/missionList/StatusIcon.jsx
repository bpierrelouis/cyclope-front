import { CircleCheckIcon, CircleXIcon } from 'lucide-react';

export function StatusIcon(props) {
    const { status } = props;

    return (
        <div className='size-6'>
            {status === 'DONE' && <CircleCheckIcon className='size-full text-success' />}
            {status === 'ERROR' && <CircleXIcon className='size-full text-error' />}
            {['RUNNING', 'PENDING'].includes(status) && (
                <span className='loading loading-spinner'></span>
            )}
        </div>
    );
}

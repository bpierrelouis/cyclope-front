import { CircleCheckIcon, CircleXIcon } from 'lucide-react';

export function StatusIcon(props) {
    const { status, percentage } = props;

    return (
        <div className='size-6'>
            {status === 'finished' && <CircleCheckIcon className='size-full text-success' />}
            {status === 'error' && <CircleXIcon className='size-full text-error' />}
            {status === 'progress' && (
                <div
                    className='size-5 text-info radial-progress'
                    style={{ '--value': percentage, '--size': 'calc(var(--spacing) * 5)', '--thickness': '3px' }}
                    aria-valuenow={percentage}
                ></div>
            )}
        </div>
    );
}

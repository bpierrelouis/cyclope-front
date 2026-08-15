import { Suspense } from 'react';

export function AsyncView({ children }) {
    return (
        <Suspense fallback={<ViewLoading />}>
            {children}
        </Suspense>
    );
}

function ViewLoading() {
    return (
        <div
            className='flex flex-1 justify-center items-center bg-base-300 min-h-0'
            role='status'
        >
            <span className='loading loading-spinner loading-lg' />
            <span className='sr-only'>Chargement de la vue…</span>
        </div>
    );
}

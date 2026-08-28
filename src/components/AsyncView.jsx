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
            className='place-items-center grid bg-base-300 size-full'
            role='status'
        >
            <span className='loading loading-spinner loading-lg' />
            <span className='sr-only'>Chargement de la vue…</span>
        </div>
    );
}

export function FileUploadProgress({ progress }) {
    if (!progress) return null;

    const percentage = Math.round((progress.completed / progress.total) * 100);

    return (
        <div className='px-3 py-2 border-base-300 border-b shrink-0'>
            <span
                aria-live='polite'
                className='gap-2 badge badge-primary badge-soft'
                role='status'
            >
                {percentage === 0 ? (
                    <span
                        aria-label='Import en cours de démarrage'
                        className='loading loading-spinner loading-xs'
                    />
                ) : (
                    <span
                        aria-label={`${percentage} % importés`}
                        aria-valuemax={100}
                        aria-valuemin={0}
                        aria-valuenow={percentage}
                        className='radial-progress'
                        role='progressbar'
                        style={{
                            '--size': '1rem',
                            '--thickness': '2px',
                            '--value': percentage,
                        }}
                    />
                )}
                Import en cours
                <span className='font-medium tabular-nums'>
                    {progress.completed}/{progress.total}
                </span>
            </span>
        </div>
    );
}

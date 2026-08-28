import { DownloadIcon, LoaderCircleIcon } from 'lucide-react';

import { iconSizes } from '../../constants';

export function ResultPopupSidebar(props) {
    const {
        hasUntyped, isDownloading, isPending, onDownload, result,
    } = props;
    const rows = [
        { label: 'Frame', value: result.index },
        { label: 'Latitude', value: result.latitudeValue ?? '—' },
        { label: 'Longitude', value: result.longitudeValue ?? '—' },
        { label: 'Altitude', value: result.altitudeLabel },
        { label: 'Vitesse', value: result.speedLabel },
    ];

    return (
        <div className='flex flex-col self-stretch gap-3 w-2xs shrink-0'>
            <dl className='rounded-box overflow-y-auto stats stats-vertical'>
                {rows.map(({ label, value }) => (
                    <div key={label} className='px-4 py-2 stat'>
                        <dt className='stat-title'>{label}</dt>
                        <dd className='font-semibold tabular-nums text-base stat-value'>{value}</dd>
                    </div>
                ))}
            </dl>

            <div className='flex flex-col flex-1 gap-2'>
                {hasUntyped && (
                    <span className='text-warning text-xs'>Choisissez un type pour chaque rectangle.</span>
                )}
                {isPending && (
                    <span className='opacity-60 text-xs'>Enregistrement en cours…</span>
                )}
                <button
                    type='button'
                    aria-label="Télécharger l'image"
                    className='self-center mt-auto btn-outline btn btn-wide'
                    disabled={isDownloading}
                    onClick={onDownload}
                >
                    {isDownloading
                        ? <LoaderCircleIcon className='animate-spin' size={iconSizes.sm} />
                        : <DownloadIcon size={iconSizes.sm} />}
                    Télécharger l'image
                </button>
            </div>
        </div>
    );
}

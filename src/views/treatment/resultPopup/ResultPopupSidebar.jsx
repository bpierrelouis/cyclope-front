import { DownloadIcon } from 'lucide-react';

import { ConfidenceBadges } from '../ConfidenceBadges';

export function ResultPopupSidebar(props) {
    const {
        hasUntyped, isPending, result, viewSrc,
    } = props;
    const rows = [
        { label: 'Frame', value: result.index },
        { label: 'Latitude', value: result.latitudeValue ?? '—' },
        { label: 'Longitude', value: result.longitudeValue ?? '—' },
        { label: 'Altitude', value: result.altitudeLabel },
        { label: 'Vitesse', value: result.speedLabel },
    ];

    return (
        <div className='flex flex-col self-start gap-3 w-2xs shrink-0'>
            <dl className='rounded-box overflow-y-auto stats stats-vertical'>
                {rows.map(({ label, value }) => (
                    <div key={label} className='px-4 py-2 stat'>
                        <dt className='stat-title'>{label}</dt>
                        <dd className='font-semibold tabular-nums text-base stat-value'>{value}</dd>
                    </div>
                ))}
                <div className='px-4 py-2 stat'>
                    <span className='stat-title'>Détection</span>
                    <div className='flex flex-wrap gap-1 stat-value'>
                        <ConfidenceBadges result={result} />
                    </div>
                </div>
            </dl>

            <div className='flex flex-col gap-2'>
                {hasUntyped && (
                    <span className='text-warning text-xs'>Choisissez un type pour chaque rectangle.</span>
                )}
                {isPending && (
                    <span className='opacity-60 text-xs'>Enregistrement en cours…</span>
                )}
                <a
                    className='btn-outline btn btn-sm'
                    href={viewSrc}
                    download={`detection-frame-${result.index ?? result.id}.jpg`}
                    aria-disabled={!viewSrc}
                    onClick={(event) => {
                        if (!viewSrc) event.preventDefault();
                    }}
                >
                    <DownloadIcon size={16} /> Télécharger l'image
                </a>
            </div>
        </div>
    );
}

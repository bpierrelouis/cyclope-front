import { filesQueries } from '../../hooks';
import { ConfidenceBadges } from './ConfidenceBadges';

export function ResultPopup(props) {
    const { result, dismiss } = props;
    const { data } = filesQueries.useGetContent(result.url);

    const rows = [
        { label: 'Frame', value: result.index },
        { label: 'Latitude', value: result.coordinates.latitude },
        { label: 'Longitude', value: result.coordinates.longitude },
        { label: 'Altitude', value: result.altitudeLabel },
        { label: 'Vitesse', value: result.speedLabel },
    ];

    return (
        <dialog className='modal modal-open'>
            <div className='flex gap-4 p-4 w-3/4 max-w-7xl modal-box'>

                <div className='flex-1 min-w-0'>
                    {data
                        ? <img src={data} alt='frame' className='rounded-lg w-full max-h-[70vh] object-contain' />
                        : <div className='flex justify-center items-center bg-base-200 rounded-lg w-full aspect-video text-base-content/50'>Pas d'image</div>}
                </div>

                <div className='flex flex-col self-start gap-1 w-2xs overflow-y-auto shrink-0'>
                    {rows.map(({ label, value }) => (
                        <div key={label} className='flex justify-between items-baseline gap-4 bg-base-200 px-3 py-2 rounded-lg'>
                            <dt className='text-sm text-base-content/60'>{label}</dt>
                            <dd className='font-semibold tabular-nums'>{value}</dd>
                        </div>
                    ))}
                    <div className='flex flex-col gap-1.5 bg-base-200 px-3 py-2 rounded-lg'>
                        <span className='text-sm text-base-content/60'>Détection</span>
                        <ConfidenceBadges result={result} />
                    </div>
                </div>

            </div>
            <form method='dialog' className='modal-backdrop'>
                <button onClick={dismiss}>Fermer</button>
            </form>
        </dialog>
    );
}

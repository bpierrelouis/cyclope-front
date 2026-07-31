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

                <dl className='self-start rounded-box w-2xs overflow-y-auto stats stats-vertical shrink-0'>
                    {rows.map(({ label, value }) => (
                        <div key={label} className='px-4 py-2 stat'>
                            <dt className='stat-title'>{label}</dt>
                            <dd className='font-semibold text-base stat-value tabular-nums'>{value}</dd>
                        </div>
                    ))}
                    <div className='px-4 py-2 stat'>
                        <span className='stat-title'>Détection</span>
                        <div className='stat-value'><ConfidenceBadges result={result} /></div>
                    </div>
                </dl>

            </div>
            <form method='dialog' className='modal-backdrop'>
                <button onClick={dismiss}>Fermer</button>
            </form>
        </dialog>
    );
}

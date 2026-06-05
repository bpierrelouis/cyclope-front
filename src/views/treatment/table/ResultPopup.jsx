import { ConfidenceBadge } from '../../../components';
import { filesQueries } from '../../../hooks';

export function ResultPopup(props) {
    const { result, dismiss } = props;
    const { data } = filesQueries.useGetContent(result.url);
    console.log(result);
    return (
        <dialog className='modal modal-open'>
            <div className='flex gap-4 p-4 w-3/4 max-w-7xl modal-box'>

                <div className='flex-1'>
                    {data
                        ? <img src={data} alt='frame' className='rounded-lg w-full h-full object-cover' />
                        : <div className='flex justify-center items-center bg-base-200 rounded-lg w-full h-full text-base-content/50'>Pas d'image</div>}
                </div>

                <div className='flex flex-col self-center gap-2 w-2xs overflow-y-auto'>
                    {[
                        { label: 'Frame', value: result.index },
                        { label: 'Latitude', value: result.coordinates.latitude },
                        { label: 'Longitude', value: result.coordinates.longitude },
                        { label: 'Altitude', value: `${result.altitude.value} ${result.altitude.unit}` },
                        { label: 'Vitesse', value: `${result.speed.value} ${result.speed.unit}` },
                    ].map(({ label, value }) => (
                        <div key={label} className='flex flex-wrap justify-between items-center bg-base-200 px-2 py-1 rounded-field'>
                            <span className='stat-title'>{label}</span>
                            <span className='text-lg stat-value'>{value}</span>
                        </div>
                    ))}
                    <div className='flex flex-wrap justify-center items-center gap-1 bg-base-200 px-2 py-1 rounded-field'>
                        <span className='basis-full stat-title'>Détection</span>
                        {result.objects?.map((obj) => (
                            <ConfidenceBadge key={obj.type} object={obj} />
                        ))}
                    </div>
                </div>

            </div>
            <form method='dialog' className='modal-backdrop'>
                <button onClick={dismiss}>Fermer</button>
            </form>
        </dialog>
    );
}

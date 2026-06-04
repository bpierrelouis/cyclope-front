export function ResultPopup(props) {
    const { result, dismiss } = props;
    return (
        <dialog className='modal modal-open'>
            <div className='flex gap-4 p-4 w-3/4 max-w-7xl modal-box'>

                <div className='flex-1'>
                    {result.url
                        ? <img src={result.url} alt='frame' className='rounded-lg w-full h-full object-cover' />
                        : <div className='flex justify-center items-center bg-base-200 rounded-lg w-full h-full text-base-content/50'>Pas d'image</div>}
                </div>

                <div className='flex flex-col gap-2 w-56 overflow-y-auto'>
                    {[
                        { label: 'Frame', value: result.index },
                        { label: 'Latitude', value: result.coordinates.latitude },
                        { label: 'Longitude', value: result.coordinates.longitude },
                        { label: 'Altitude', value: `${result.altitude.value} ${result.altitude.unit}` },
                        { label: 'Vitesse', value: `${result.speed.value} ${result.speed.unit}` },
                    ].map(({ label, value }) => (
                        <div key={label} className='bg-base-200 rounded-lg stat'>
                            <div className='stat-title'>{label}</div>
                            <div className='text-lg stat-value'>{value}</div>
                        </div>
                    ))}
                </div>

            </div>
            <form method='dialog' className='modal-backdrop'>
                <button onClick={dismiss}>Fermer</button>
            </form>
        </dialog>
    );
}

export function RangeSettings({ title, min, max, value, onChange, format, ticks = [], scale = 'linear' }) {

    const valueToSliderPos = (v) =>
        scale === 'log'
            ? Math.log(v / min) / Math.log(max / min)
            : (v - min) / (max - min);

    const sliderPosToValue = (pos) =>
        scale === 'log'
            ? min * Math.pow(max / min, pos)
            : min + pos * (max - min);

    return (
        <div className='card bg-base-200 shadow-md max-w-md card-body gap-4'>
            <div className='flex items-center justify-between'>
                <h2 className='card-title text-base'>{title}</h2>
                <span className='badge badge-primary'>
                    {format(value)}
                </span>
            </div>

            <input
                type='range'
                min={0}
                max={1}
                step={0.001}
                value={valueToSliderPos(value)}
                onChange={(e) => onChange(sliderPosToValue(Number.parseFloat(e.target.value)))}
                className='range range-primary'
            />

            {ticks.length > 0 && (
                <div className='flex justify-between text-xs'>
                    {ticks.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            )}
        </div>
    );
}
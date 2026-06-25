import { useSelectionContext } from '../../contexts';
import { usePlayerStore } from '../../stores';
import { getCurrentResult } from '../../utils';

export function TreatmentHeader() {
    const { mission, results } = useSelectionContext();
    const { currentTime } = usePlayerStore();

    const current = getCurrentResult(results, currentTime);

    const position = current?.coordinates
        ? `${current.coordinates.latitude} · ${current.coordinates.longitude}`
        : '—';

    return (
        <header className='col-span-full cyc-header'>
            <Item title='MISSION' value={mission?.name} />
            <Item title='FRAME' value={current?.index} />
            <Item title='ALT' value={current?.altitudeLabel} />
            <Item title='VITESSE' value={current?.speedLabel} />
            <Item title='POSITION' value={position} />
        </header>
    );
}

function Item(props) {
    const { title, value } = props;
    return (
        <div className='cyc-stat first:grow'>
            <span className='cyc-stat-label'>{title}</span>
            <span className='cyc-stat-value'>{value ?? '-'}</span>
        </div>
    );
}

import { useSelectionContext } from '../../contexts';
import { usePlayerStore } from '../../stores';
import { getCurrentResult } from '../../utils';
import { TreatmentSelector } from './TreatmentSelector';

export function TreatmentHeader() {
    const { mission, results } = useSelectionContext();
    const { currentTime } = usePlayerStore();

    const current = getCurrentResult(results, currentTime);

    const position = current?.coordinates
        ? `${current.coordinates.latitude} · ${current.coordinates.longitude}`
        : '—';

    return (
        <header className='col-span-full cyc-header'>
            <ItemText title='MISSION' value={mission?.name} />
            <Item title='TRAITEMENT'>
                <TreatmentSelector />
            </Item>
            <ItemText title='FRAME' value={current?.index} />
            <ItemText title='ALT' value={current?.altitudeLabel} />
            <ItemText title='VITESSE' value={current?.speedLabel} />
            <ItemText title='POSITION' value={position} />
        </header>
    );
}

function ItemText(props) {
    const { title, value } = props;
    return (
        <Item title={title}>
            {value ?? '-'}
        </Item>
    );
}

function Item(props) {
    const { title, children } = props;
    return (
        <div className='cyc-stat nth-[2]:grow'>
            <span className='cyc-stat-label'>{title}</span>
            <span className='cyc-stat-value'>{children}</span>
        </div>
    );
}

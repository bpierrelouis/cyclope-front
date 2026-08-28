import { useMissionCollapseStore } from '../../stores';
import { MissionHeader } from './MissionHeader';
import { MissionMediaList } from './MissionMediaList';

export function MissionListItem(props) {
    const mission = props.mission;
    const opened = useMissionCollapseStore((state) => state.opened);

    const isOpened = mission.id === opened;

    return (
        <article className='bg-base-100 border border-base-300 shadow-sm card overflow-clip'>
            <MissionHeader mission={mission} />
            {isOpened && <MissionMediaList mission={mission} />}
        </article>
    );
}

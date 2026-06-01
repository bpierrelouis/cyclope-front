import { useMissionCollapseStore } from '../../stores';
import { MissionHeader } from './MissionHeader';
import { MissionMediaList } from './MissionMediaList';

export function MissionListItem(props) {
    const mission = props.mission;
    const { opened } = useMissionCollapseStore();

    const isOpened = mission.id === opened;

    return (
        <div className='bg-base-100 shadow-md rounded-box overflow-clip'>
            <MissionHeader mission={mission} />
            {isOpened && <MissionMediaList mission={mission} />}
        </div>
    );
}

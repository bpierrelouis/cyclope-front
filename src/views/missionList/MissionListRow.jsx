import { FolderIcon } from 'lucide-react';
import { Link } from 'react-router';
import { EditableText } from '../../components';
import { ROUTES, STATUS_LABELS } from '../../constants';
import { missionsQueries } from '../../hooks';
import { getMissionDescription, preventDefault } from '../../utils';

export function MissionListRow(props) {
    const mission = props.mission;

    const updateMutation = missionsQueries.useUpdate();
    const deleteMutation = missionsQueries.useDelete();
    const onDelete = () => deleteMutation.mutate(mission.id);

    const description = getMissionDescription(mission);
    const badgeColor = {
        finished: 'badge-success',
        progress: 'badge-info',
        error: 'badge-error',
    }[mission.status];
    const transitionClasses = 'transition-all duration-200';

    const handleChangeName = (name) => {
        updateMutation.mutate({
            id: mission.id,
            data: { name },
        });
    };

    return (
        <Link
            to={{
                pathname: ROUTES.treatment,
                search: `?missionId=${mission.id}`,
            }}
            className={`list-row items-center cursor-pointer group hover:bg-base-200 ${transitionClasses}`}
        >
            <div className={`bg-base-300 rounded px-4 py-2  group-hover:bg-primary group-hover:text-primary-content ${transitionClasses}`}>
                <FolderIcon className={`group-hover:scale-110 ${transitionClasses}`} />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <EditableText
                        value={mission.name}
                        setValue={handleChangeName}
                    />

                    <span className={`badge badge-sm badge-soft ${badgeColor} group-hover:scale-105 ${transitionClasses}`}>
                        {STATUS_LABELS[mission.status]}
                    </span>
                </div>

                <div className={`text-sm opacity-50 text-left group-hover:opacity-80 ${transitionClasses}`}>
                    {description}
                </div>
            </div>

            <div className={`flex gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${transitionClasses}`}>
                <button className='btn btn-sm btn-soft btn-error' onClick={preventDefault(onDelete)}>
                    Supprimer
                </button>
            </div>
        </Link>
    );
}

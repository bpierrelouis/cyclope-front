import { Link } from 'react-router';
import { FolderIcon } from '../../assets/icons';
import { STATUS_LABELS } from '../../constants/labels';
import { missionsQueries } from '../../hooks';
import { ROUTES } from '../../router';
import { getMissionDescription } from '../../utils/labels';
import { preventDefault } from '../../utils/others';

export default function Mission(props) {
    const mission = props.mission;

    const mutation = missionsQueries.useDelete();
    const onDelete = () => mutation.mutate(mission.id);

    const description = getMissionDescription(mission);
    const badgeColor = {
        finished: 'badge-success',
        progress: 'badge-info',
        error: 'badge-error',
    }[mission.status];
    const transitionClasses = 'transition-all duration-200';

    return (
        <Link
            to={{
                pathname: ROUTES.treatment,
                search: `?missionId=${mission.id}`,
            }}
            className={`list-row items-center cursor-pointer group hover:bg-base-200 ${transitionClasses}`}
        >
            <div className={`bg-base-300 rounded px-4 py-2  group-hover:bg-primary group-hover:text-primary-content ${transitionClasses}`}>
                <FolderIcon className={`size-5 group-hover:scale-110 ${transitionClasses}`} />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <span className={`font-medium group-hover:text-primary ${transitionClasses}`}>
                        {mission.name}
                    </span>

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

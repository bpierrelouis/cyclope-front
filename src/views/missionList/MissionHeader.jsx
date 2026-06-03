import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { Link } from 'react-router';
import { DeleteMissionPopup } from './DeleteMissionPopup.jsx';
import { EditableText } from '../../components';
import { BADGE_COLOR_BY_STATUS, ROUTES, STATUS_LABELS } from '../../constants';
import { mediasQueries, missionsQueries } from '../../hooks';
import { useMissionCollapseStore } from '../../stores';
import { getMissionDescription, preventDefault } from '../../utils';
import { useState } from 'react';


export function MissionHeader(props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { opened, toggle } = useMissionCollapseStore();

    const mission = props.mission;
    const { data: medias } = mediasQueries.useGetAllByMissionId(mission.id);

    const updateMutation = missionsQueries.useUpdate();
    const deleteMutation = missionsQueries.useDelete();

    const description = getMissionDescription(mission);
    const mediaCount = medias?.length ?? 0;

    const handleChangeName = (name) => {
        if (name === mission.name) return;
        updateMutation.mutate({
            id: mission.id,
            data: { name },
        });
    };

    const handleOpen = () => toggle(mission.id);
    const openConfirm = () => setConfirmOpen(true);
    const closeConfirm = () => setConfirmOpen(false);

    const handleDelete = () => {
        deleteMutation.mutate(mission.id);
        closeConfirm();
    };

    const badgeColor = BADGE_COLOR_BY_STATUS[mission.status];

    return (
        <Link
            className='group flex items-center gap-2 hover:bg-base-200 px-3 py-2 cursor-pointer'
            to={{
                pathname: ROUTES.treatment,
                search: `?missionId=${mission.id}`,
            }}
        >
            <button
                className='btn btn-soft'
                onClick={preventDefault(handleOpen)}
            >
                {opened === mission.id ? <FolderOpenIcon /> : <FolderIcon />}
            </button>

            <div className='flex-1'>
                <div className='flex items-center gap-2'>
                    <EditableText
                        value={mission.name}
                        setValue={handleChangeName}
                    />

                    {opened !== mission.id && (
                        <span className={`badge badge-sm badge-soft ${badgeColor}`}>
                            {STATUS_LABELS[mission.status]}
                        </span>
                    )}
                </div>

                <div className='opacity-50 group-hover:opacity-80 text-sm text-left'>
                    {description}
                </div>
            </div>

            <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-200'>
                <button className='btn btn-sm btn-soft btn-error' onClick={preventDefault(openConfirm)}>
                    Supprimer
                </button>
            </div>

            <DeleteMissionPopup
                open={confirmOpen}
                onClose={closeConfirm}
                onConfirm={handleDelete}
                missionName={mission.name}
                mediaCount={mediaCount}
            />
        </Link>
    );
}

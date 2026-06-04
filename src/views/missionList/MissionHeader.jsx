import { FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { EditableText } from '../../components';
import { ROUTES } from '../../constants';
import { missionsQueries } from '../../hooks';
import { useMissionCollapseStore } from '../../stores';
import { getMissionDescription, preventDefault } from '../../utils';
import { DeleteMissionPopup } from './DeleteMissionPopup';
import { StatusBadge } from './StatusBadge';

export function MissionHeader(props) {
    const { mission } = props;

    const { opened, toggle } = useMissionCollapseStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updateMutation = missionsQueries.useUpdate();

    const description = getMissionDescription(mission);

    const handleChangeName = (name) => {
        if (name === mission.name) return;
        updateMutation.mutate({
            id: mission.id,
            data: { name },
        });
    };

    const handleOpen = () => toggle(mission.id);
    const handleDelete = () => setIsModalOpen(true);

    return (
        <>
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
                        {opened !== mission.id && (<>
                            {mission.containsDone && <StatusBadge color='badge-success' label='Terminée(s)' />}
                            {mission.containsProgress && <StatusBadge color='badge-info' label='En cours' />}
                            {mission.containsPending && <StatusBadge color='badge-info' label='En attente' />}
                            {mission.containsError && <StatusBadge color='badge-error' label='En erreur' />}
                        </>)}
                    </div>

                    <div className='opacity-50 group-hover:opacity-80 text-sm text-left'>
                        {description}
                    </div>
                </div>

                <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-200'>
                    <button className='btn btn-sm btn-soft btn-error' onClick={preventDefault(handleDelete)}>
                        Supprimer
                    </button>
                </div>
            </Link>

            <DeleteMissionPopup
                mission={mission}
                openState={[isModalOpen, setIsModalOpen]}
            />
        </>
    );
}

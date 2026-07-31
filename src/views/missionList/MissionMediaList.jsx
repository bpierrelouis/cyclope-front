import { mediasQueries } from '../../hooks';
import { MissionMediaListItem } from './MissionMediaListItem';

export function MissionMediaList(props) {
    const { mission } = props;
    const { data: medias, isLoading } = mediasQueries.useGetAllByMissionId(mission.id);

    return (
        <ul className='list'>
            {isLoading && (
                <li className='place-items-center grid list-row'>
                    <span className='loading loading-spinner'></span>
                </li>
            )}
            {medias?.length === 0 && (
                <li className='opacity-60 list-row'>Aucun média</li>
            )}
            {medias?.map((media) => (
                <MissionMediaListItem
                    key={media.id}
                    media={media} />
            ))}
        </ul>
    );
}

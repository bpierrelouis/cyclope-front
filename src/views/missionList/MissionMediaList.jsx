import { mediasQueries } from '../../hooks';
import { MissionMediaListItem } from './MissionMediaListItem';

export function MissionMediaList(props) {
    const { mission } = props;
    const { data: medias, isLoading } = mediasQueries.useGetAllByMissionId(mission.id);

    return (
        <div className='py-2'>
            {isLoading && (
                <span className='block mx-auto loading loading-spinner'></span>
            )}
            {medias?.length === 0 && (
                <span className='px-8'>Aucun média</span>
            )}
            {medias?.map((media) => (
                <MissionMediaListItem
                    key={media.id}
                    media={media} />
            ))}
        </div>
    );
}

import { Link } from 'react-router';
import { MediaIcon } from '../../components';
import { ERoute } from '../../constants';

export function MissionMediaListItem(props) {
    const { media } = props;

    const color = {
        'DONE': 'text-success',
        'RUNNING': 'text-info',
        'PENDING': 'text-warning',
        'ERROR': 'text-error',
    }[media.status];

    return (
        <Link
            to={{
                pathname: ERoute.TREATMENT,
                search: `?media=${media.id}`,
            }}
            className={`flex items-center gap-2 hover:bg-base-200 px-8 ${color}`}
        >
            <MediaIcon isVideo={media.isVideo} />
            {media.name}
            {media.status === 'RUNNING' && (
                <progress className='flex-1 progress progress-info' value={media.percentage || 0} max='100'></progress>
            )}
        </Link>
    );
}

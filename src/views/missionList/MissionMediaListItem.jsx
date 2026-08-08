import { Link } from 'react-router';

import { MediaIcon } from '../../components';
import { ERoute } from '../../constants';

export function MissionMediaListItem(props) {
    const { media } = props;

    const color = {
        'DONE': 'text-success',
        'ERROR': 'text-error',
        'PENDING': 'text-warning',
        'RUNNING': 'text-info',
    }[media.status];

    return (
        <li className='grid-cols-1 p-0 list-row'>
            <Link
                to={{
                    pathname: ERoute.TREATMENT,
                    search: `?media=${media.id}`,
                }}
                className={`flex items-center gap-3 p-3 min-w-0 w-full hover:bg-base-200 ${color}`}
            >
                <MediaIcon isVideo={media.isVideo} className='shrink-0' />
                <span className='min-w-0 truncate'>{media.name}</span>
                {media.status === 'RUNNING' && (
                    <progress
                        aria-label={`Progression de ${media.name}`}
                        className='ml-auto w-1/2 min-w-24 progress progress-info'
                        value={media.percentage ?? 0}
                        max='100'
                    />
                )}
            </Link>
        </li>
    );
}

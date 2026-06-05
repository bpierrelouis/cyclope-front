import { FilmIcon, ImageIcon } from 'lucide-react';
import { Link } from 'react-router';
import { ROUTES } from '../../constants';
import { StatusIcon } from './StatusIcon';

export function MissionMediaListItem(props) {
    const { media } = props;

    return (
        <Link
            to={{
                pathname: ROUTES.treatment,
                search: `?media=${media.id}`,
            }}
            className='flex items-center gap-2 hover:bg-base-200 px-8'
        >
            <span className='opacity-50'>
                {media.isVideo ? <FilmIcon /> : <ImageIcon />}
            </span>
            <StatusIcon status={media.status} />
            {media.name}
        </Link>
    );
}

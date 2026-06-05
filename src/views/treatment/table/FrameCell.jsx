import { filesQueries } from '../../../hooks';
import { preventDefault } from '../../../utils';

export function FrameCell(props) {
    const { url, onClick } = props;

    const { data } = filesQueries.useGetContent(url);

    return data ? (
        <img
            src={data}
            alt='frame'
            style={{ width: 40, height: 30, objectFit: 'cover' }}
            className='hover:opacity-80 rounded cursor-pointer'
            onClick={preventDefault(onClick)} />
    ) : (
        <span>—</span>
    );
}

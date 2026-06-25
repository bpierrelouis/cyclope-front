import { filesQueries } from '../../../hooks';
import { preventDefault } from '../../../utils';

export function FrameCell(props) {
    const { row, onClick } = props;
    const result = row.original;

    const { data } = filesQueries.useGetContent(result.url);

    const setSelected = () => onClick(result);

    return data ? (
        <img
            src={data}
            alt='frame'
            style={{ width: 40, height: 30, objectFit: 'cover' }}
            className='hover:opacity-80 rounded cursor-pointer'
            onClick={preventDefault(setSelected)} />
    ) : (
        <span>—</span>
    );
}

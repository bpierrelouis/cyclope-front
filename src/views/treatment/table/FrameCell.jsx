import { filesQueries } from '../../../hooks';
import { preventDefault } from '../../../utils';

export function FrameCell(props) {
    const { data: result, onClick } = props;
    const { data: imageSrc } = filesQueries.useGetContent(result.url);

    const setSelected = () => onClick(result);

    return imageSrc ? (
        <img
            src={imageSrc}
            alt='frame'
            className='w-10 h-[30px] object-cover hover:opacity-80 rounded cursor-pointer'
            onClick={preventDefault(setSelected)} />
    ) : (
        <span>—</span>
    );
}

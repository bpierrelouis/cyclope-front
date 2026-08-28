import { framesQueries } from '../../hooks';
import { preventDefault } from '../../utils';

export function FrameCell(props) {
    const {
        data: result, onClick, timelineResultsById,
    } = props;
    const media = timelineResultsById.get(result.id)?.media;
    const { data: imageSrc } = framesQueries.useThumbnail(result, media);

    const setSelected = () => onClick(result);

    return imageSrc ? (
        <img
            src={imageSrc}
            alt='frame'
            className='hover:opacity-80 rounded w-10 h-[30px] object-cover cursor-pointer'
            onClick={preventDefault(setSelected)} />
    ) : (
        <span>—</span>
    );
}

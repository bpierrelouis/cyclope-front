import { filesQueries, framesQueries } from '../../../hooks';
import { preventDefault } from '../../../utils';

export function FrameCell(props) {
    const {
        data: result, onClick, timelineResultsById,
    } = props;
    const media = timelineResultsById.get(result.id)?.media;
    const { data: legacySrc } = filesQueries.useGetContent(result.url);
    const { data: frameSrc } = framesQueries.useResultFrame(result, {
        enabled: !result.url,
        media,
    });
    const imageSrc = result.url ? legacySrc : frameSrc;

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

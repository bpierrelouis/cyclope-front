import { preventDefault } from '../../../utils';

export function FrameCell(props) {
    const { url, onClick } = props;

    return url ? (
        <img
            src={url}
            alt='frame'
            style={{ width: 40, height: 30, objectFit: 'cover' }}
            className='hover:opacity-80 rounded cursor-pointer'
            onClick={preventDefault(onClick)} />
    ) : (
        <span>—</span>
    );
}

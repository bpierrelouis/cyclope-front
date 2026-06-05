import { FilmIcon, ImageIcon } from 'lucide-react';

export function MediaIcon(props) {
    const { isVideo, ...otherProps } = props;
    return isVideo ? <FilmIcon {...otherProps} /> : <ImageIcon {...otherProps} />;
}

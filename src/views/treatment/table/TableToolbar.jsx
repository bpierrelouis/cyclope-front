import { DownloadIcon, StarOffIcon } from 'lucide-react';
import { iconSizes } from '../../../constants';
import { ColumnsMenu } from './ColumnsMenu';

export function TableToolbar(props) {
    const { favoriteCount, onClearFavorites, onExport } = props;

    return (
        <div className='flex gap-1 m-1'>
            <ColumnsMenu />

            {favoriteCount > 0 && (
                <button
                    type='button'
                    onClick={onClearFavorites}
                    className='btn btn-ghost btn-error'
                >
                    <StarOffIcon size={iconSizes.sm} />
                    Vider
                </button>
            )}

            <span className='flex-1' />

            <button
                type='button'
                onClick={onExport}
                className='btn btn-ghost'
            >
                <DownloadIcon size={iconSizes.sm} />
                Exporter CSV
            </button>
        </div>
    );
}

import { ResultPopup } from '../ResultPopup';
import { ResultsGrid } from './ResultsGrid';
import { TableToolbar } from './TableToolbar';
import { useTableController } from './useTableController';

export function Table() {
    const {
        selected,
        dismissSelected,
        favoriteCount,
        unfavoriteAll,
        exportCsv,
        detectionFilterActive,
        gridProps,
    } = useTableController();

    return (
        <div className='relative flex flex-col flex-1 h-full'>
            <TableToolbar
                favoriteCount={favoriteCount}
                onClearFavorites={unfavoriteAll}
                onExport={exportCsv}
            />
            <ResultsGrid detectionFilterActive={detectionFilterActive} {...gridProps} />
            {selected && <ResultPopup result={selected} dismiss={dismissSelected} />}
        </div>
    );
}

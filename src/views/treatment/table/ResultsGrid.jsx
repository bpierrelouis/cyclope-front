import { AG_GRID_LOCALE_FR } from '@ag-grid-community/locale';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import { DEFAULT_COL_DEF } from '../../../constants';
import { cn } from '../../../utils';

ModuleRegistry.registerModules([AllCommunityModule]);

export function ResultsGrid(props) {
    const { gridRef, detectionFilterActive, ...gridProps } = props;

    return (
        <div
            className={cn(
                'flex-1 cyc-results-grid min-h-0',
                detectionFilterActive && 'has-detection-filter',
            )}
        >
            <AgGridReact
                localeText={AG_GRID_LOCALE_FR}
                ref={gridRef}
                defaultColDef={DEFAULT_COL_DEF}
                enableFilterHandlers={true}
                getRowId={({ data }) => String(data.id)}
                stopEditingWhenCellsLoseFocus={true}
                {...gridProps}
            />
        </div>
    );
}

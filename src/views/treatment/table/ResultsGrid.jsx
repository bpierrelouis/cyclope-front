import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

import { cn } from '../../../utils';
import { DEFAULT_COL_DEF } from './table.utils';

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

import { getTimestamp, suppressExtension } from '../../../utils';
import { getColumnOptions } from './columnDefs';

const EXPORT_FALLBACK_NAME = 'export';
const HIDEABLE_COLUMN_IDS = getColumnOptions().map(({ field }) => field);

export const DEFAULT_COL_DEF = {
    flex: 1,
    sortable: true,
    resizable: true,
    suppressMovable: true,
    suppressHeaderMenuButton: true,
};

export const applyColumnVisibility = (api, hiddenColumnIds) => {
    const hiddenIds = new Set(hiddenColumnIds);
    api.setColumnsVisible(
        HIDEABLE_COLUMN_IDS.filter((colId) => !hiddenIds.has(colId)),
        true,
    );
    api.setColumnsVisible(
        HIDEABLE_COLUMN_IDS.filter((colId) => hiddenIds.has(colId)),
        false,
    );
};

export const getExportParams = (api, mediaName) => ({
    fileName: `${suppressExtension(mediaName ?? EXPORT_FALLBACK_NAME)}_${getTimestamp()}.csv`,
    skipColumnHeaders: false,
    columnKeys: api
        .getAllDisplayedColumns()
        .map((column) => column.getColId())
        .filter((colId) => colId !== 'isFavorite'),
});

export const getChangedRowNodes = (api, ids) => ids
    .filter((id) => id != null)
    .map((id) => api.getRowNode(String(id)))
    .filter(Boolean);

export const prepareResultPatch = (event) => {
    const result = event.data;
    const edit = event.column.getColDef().context?.edit;
    if (!edit) return null;
    if (event.newValue === event.oldValue) return null;

    const value = edit.parse(event.newValue);
    if (value == null) return { errorMessage: edit.errorMessage };

    return {
        variables: {
            id: result.id,
            data: { responseJson: edit.createPatch(result, value) },
        },
    };
};

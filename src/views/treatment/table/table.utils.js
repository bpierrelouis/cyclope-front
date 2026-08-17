import { getTimestamp, suppressExtension } from '../../../utils';
import { getColumnOptions } from './columnDefs';

const EXPORT_FALLBACK_NAME = 'export';
const HIDEABLE_COLUMN_IDS = getColumnOptions(true).map(({ id }) => id);

export const DEFAULT_COL_DEF = {
    flex: 1,
    resizable: true,
    sortable: true,
    suppressHeaderMenuButton: true,
    suppressMovable: true,
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
    columnKeys: api
        .getAllDisplayedColumns()
        .map((column) => column.getColId())
        .filter((colId) => colId !== 'isFavorite'),
    fileName: `${suppressExtension(mediaName ?? EXPORT_FALLBACK_NAME)}_${getTimestamp()}.csv`,
    skipColumnHeaders: false,
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
    const previousValue = edit.parse(event.oldValue);
    if (previousValue != null && edit.isEqual(value, previousValue)) return null;

    return {
        variables: {
            data: { responseJson: edit.createPatch(result, value) },
            id: result.id,
        },
    };
};

import { suppressExtension } from './files';
import { getTimestamp } from './others';

const EXPORT_FALLBACK_NAME = 'export';

const getHideableColumnIds = (api) => api
    .getColumns()
    .filter((column) => !column.getColDef().context?.isControlColumn)
    .map((column) => column.getColId());

export const applyColumnVisibility = (api, hiddenColumnIds) => {
    const hiddenIds = new Set(hiddenColumnIds);
    const hideableColumnIds = getHideableColumnIds(api);
    api.setColumnsVisible(
        hideableColumnIds.filter((colId) => !hiddenIds.has(colId)),
        true,
    );
    api.setColumnsVisible(
        hideableColumnIds.filter((colId) => hiddenIds.has(colId)),
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

export const getJsonExportBlob = (results) => new Blob([
    JSON.stringify(results.map(({ meta }) => meta), null, 2),
], { type: 'application/json;charset=utf-8' });

export const getJsonExportFileName = (sourceName) =>
    `results_${sourceName ?? EXPORT_FALLBACK_NAME}.json`;

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

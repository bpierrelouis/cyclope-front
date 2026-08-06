import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DETECTION_FORMAT_MESSAGE, NOTIFICATION_LABELS } from '../../../constants';
import { resultsQueries } from '../../../hooks';
import { tableService } from '../../../services';
import { usePlayerStore, useTableStore } from '../../../stores';
import { dismissToast, getCurrentResult, openErrorToast, openInfoToast, openSuccessToast, sendOpenStateToMaster } from '../../../utils';
import { getColumnDefs } from './columnDefs';
import { applyColumnVisibility, getChangedRowNodes, getExportParams, prepareResultPatch } from './table.utils';

const DETECTION_HELP_TOAST_ID = 'detection-format-help';

export const useTableController = () => {
    const { isMaster, media, results, currentTime } = usePlayerStore();
    const { hiddenColumnIds, filterModel } = useTableStore();
    const { mutate: updateResult } = resultsQueries.useUpdate();
    const [selected, setSelected] = useState(null);
    const gridRef = useRef(null);
    const currentResultIdRef = useRef(null);

    const favoriteResults = useMemo(
        () => (results ?? []).filter((result) => result.isFavorite),
        [results],
    );
    const currentResultId = useMemo(
        () => getCurrentResult(results, currentTime)?.id ?? null,
        [results, currentTime],
    );
    const columnDefs = useMemo(() => getColumnDefs(setSelected), []);

    const clearFavoriteFilter = useCallback(async () => {
        const api = gridRef.current?.api;
        if (!api) return;
        await api.setColumnFilterModel('isFavorite', null);
        api.onFilterChanged();
    }, []);

    const unfavoriteAll = useCallback(() => {
        favoriteResults.forEach((result) => updateResult(
            { id: result.id, data: { isFavorite: false } },
            { onError: () => openErrorToast(NOTIFICATION_LABELS.FAVORITE_SAVE_ERROR) },
        ));

        if (filterModel.isFavorite) clearFavoriteFilter();
    }, [favoriteResults, updateResult, filterModel.isFavorite, clearFavoriteFilter]);

    const saveResult = useCallback((event) => {
        const prepared = prepareResultPatch(event);
        if (!prepared) return;
        if (prepared.errorMessage) {
            openErrorToast(prepared.errorMessage);
            return;
        }

        updateResult(prepared.variables, {
            onSuccess: () => openSuccessToast(NOTIFICATION_LABELS.RESULT_SAVED),
            onError: () => openErrorToast(NOTIFICATION_LABELS.RESULT_SAVE_ERROR),
        });
    }, [updateResult]);

    const showDetectionHelp = useCallback(({ column }) => {
        if (column.getColId() !== 'objects') return;
        openInfoToast(DETECTION_FORMAT_MESSAGE, {
            id: DETECTION_HELP_TOAST_ID,
            position: 'top-center',
            duration: Infinity,
        });
    }, []);

    const hideDetectionHelp = useCallback(({ column }) => {
        if (column.getColId() === 'objects') dismissToast(DETECTION_HELP_TOAST_ID);
    }, []);

    const syncFilterModel = useCallback(({ api }) => {
        tableService.syncFilterModel(api.getFilterModel());
    }, []);

    const onGridReady = useCallback(({ api }) => {
        api.setFilterModel(filterModel);
        applyColumnVisibility(api, hiddenColumnIds);
    }, [filterModel, hiddenColumnIds]);

    const getRowClass = useCallback(
        ({ data }) => data.id === currentResultIdRef.current
            ? 'bg-primary/20! transition-colors'
            : 'transition-colors',
        [],
    );

    const exportCsv = useCallback(() => {
        const api = gridRef.current?.api;
        if (api) api.exportDataAsCsv(getExportParams(api, media?.name));
    }, [media?.name]);

    useEffect(() => {
        const api = gridRef.current?.api;
        if (api) applyColumnVisibility(api, hiddenColumnIds);
    }, [hiddenColumnIds]);

    useEffect(() => {
        gridRef.current?.api?.onFilterChanged();
    }, [favoriteResults]);

    useEffect(() => {
        gridRef.current?.api?.setFilterModel(filterModel);
    }, [filterModel]);

    useEffect(() => {
        const api = gridRef.current?.api;
        const previousId = currentResultIdRef.current;
        currentResultIdRef.current = currentResultId;
        if (!api) return;

        api.redrawRows({
            rowNodes: getChangedRowNodes(api, [previousId, currentResultId]),
        });

        if (currentResultId != null) {
            const currentNode = api.getRowNode(String(currentResultId));
            if (currentNode) api.ensureNodeVisible(currentNode, null);
        }
    }, [currentResultId]);

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isTableOpen');
    }, [isMaster]);

    useEffect(() => () => dismissToast(DETECTION_HELP_TOAST_ID), []);

    return {
        selected,
        dismissSelected: () => setSelected(null),
        favoriteCount: favoriteResults.length,
        unfavoriteAll,
        exportCsv,
        detectionFilterActive: (filterModel.objects?.values?.length ?? 0) > 0,
        gridProps: {
            gridRef,
            rowData: results ?? [],
            columnDefs,
            getRowClass,
            readOnlyEdit: true,
            onCellEditRequest: saveResult,
            onCellEditingStarted: showDetectionHelp,
            onCellEditingStopped: hideDetectionHelp,
            onGridReady,
            onFilterChanged: syncFilterModel,
        },
    };
};

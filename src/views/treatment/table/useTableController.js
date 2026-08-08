import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { NOTIFICATION_LABELS } from '../../../constants';
import { resultsQueries, useOpenState } from '../../../hooks';
import { tableService } from '../../../services';
import { usePlayerStore, useTableStore } from '../../../stores';
import { getCurrentResult, openErrorToast, openSuccessToast } from '../../../utils';
import { getColumnDefs } from './columnDefs';
import { applyColumnVisibility, getChangedRowNodes, getExportParams, prepareResultPatch } from './table.utils';

export const useTableController = () => {
    const { media, results, currentTime } = usePlayerStore(useShallow((state) => ({
        currentTime: state.currentTime,
        media: state.media,
        results: state.results,
    })));
    const { hiddenColumnIds, filterModel } = useTableStore(useShallow((state) => ({
        filterModel: state.filterModel,
        hiddenColumnIds: state.hiddenColumnIds,
    })));
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
            { data: { isFavorite: false }, id: result.id },
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
            onError: () => openErrorToast(NOTIFICATION_LABELS.RESULT_SAVE_ERROR),
            onSuccess: () => openSuccessToast(NOTIFICATION_LABELS.RESULT_SAVED),
        });
    }, [updateResult]);

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

    useOpenState('isTableOpen');

    return {
        detectionFilterActive: (filterModel.objects?.values?.length ?? 0) > 0,
        dismissSelected: () => setSelected(null),
        exportCsv,
        favoriteCount: favoriteResults.length,
        gridProps: {
            columnDefs,
            getRowClass,
            gridRef,
            onCellEditRequest: saveResult,
            onFilterChanged: syncFilterModel,
            onGridReady,
            readOnlyEdit: true,
            rowData: results ?? [],
        },
        selected,
        unfavoriteAll,
    };
};

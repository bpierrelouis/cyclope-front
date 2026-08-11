/* Selection is synchronized with URL parameters, query results and an SSE stream. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { mediasQueries, missionsQueries, treatmentsQueries } from '../hooks';
import { resultsStream } from '../services';
import { useDetectionCatalogStore } from '../stores';
import { sortByKeyPath } from '../utils';
import { SelectionContext } from './selectionContext';

export function SelectionProvider({ children }) {
    const [searchParams] = useSearchParams();

    const [ids, setIds] = useState({});
    const [results, setResults] = useState([]);

    const { data: mission } = missionsQueries.useGetById(ids.mission);
    const { data: medias } = mediasQueries.useGetAllByMissionId(mission?.id);
    const { data: media } = mediasQueries.useGetById(ids.media);
    const { data: treatment } = treatmentsQueries.useGetById(ids.treatment);

    const setPartialIds = (partial) =>
        setIds((prev) => ({ ...prev, ...partial }));

    useEffect(() => {
        const newIds = ['mission', 'media', 'treatment']
            .reduce((acc, name) => {
                const id = searchParams.get(name);
                if (!id) return acc;
                return {
                    ...acc,
                    [name]: id,
                };
            }, {});
        setIds(newIds);
    }, [searchParams]);

    // Sélection de la mission si média sélectionné sans
    useEffect(() => {
        if (!media?.missionId || ids.mission !== undefined) return;
        setPartialIds({ mission: media.missionId });
    }, [media?.missionId, ids.mission]);

    // Sélection d'un média par défaut si mission sélectionnée sans
    useEffect(() => {
        if (ids.media !== undefined || !medias?.length) return;
        setPartialIds({ media: medias[0].id });
    }, [medias, ids.media]);

    // Sélection d'un traitement par défaut si média chargé
    useEffect(() => {
        if (ids.treatment !== undefined || !media?.lastTreatmentId) return;
        setPartialIds({ treatment: media.lastTreatmentId });
    }, [media?.lastTreatmentId, ids.treatment]);

    // Sélection d'un média par défaut si traitement sélectionné sans
    useEffect(() => {
        if (ids.media !== undefined || !treatment?.mediaId) return;
        setPartialIds({ media: treatment.mediaId });
    }, [ids.media, treatment?.mediaId]);

    useEffect(() => {
        setResults([]);
        if (!Number.isInteger(treatment?.id)) return;
        resultsStream.connect(
            treatment?.id,
            (result) => setResults((prev) => sortByKeyPath(
                [...prev.filter((r) => r.id !== result.id), result],
                'index',
            )),
        );
        return () => resultsStream.disconnect();
    }, [treatment?.id]);

    useEffect(() => {
        useDetectionCatalogStore.getState().discoverDetections(results);
    }, [results]);

    const value = useMemo(() => ({
        media,
        medias,
        mission,
        results,
        treatment,
    }), [
        mission,
        media,
        treatment,
        medias,
        results,
    ]);

    return (
        <SelectionContext.Provider
            value={value}
        >
            {children}
        </SelectionContext.Provider>
    );
}

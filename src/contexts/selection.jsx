import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { mediasQueries, missionsQueries, resultsQueries, treatmentsQueries } from '../hooks';

const SelectionContext = createContext(null);

export function SelectionProvider({ children }) {
    const [searchParams] = useSearchParams();

    const [ids, setIds] = useState({});

    const { data: mission } = missionsQueries.useGetById(ids.mission);
    const { data: medias } = mediasQueries.useGetAllByMissionId(mission?.id);

    const { data: media } = mediasQueries.useGetById(ids.media);
    const { data: lastTreatment } = treatmentsQueries.useGetLastByMediaId(media?.id);

    const { data: treatment } = treatmentsQueries.useGetById(ids.treatment);

    const { data: results } = resultsQueries.useGetAllByTreatmentId(ids.treatment);

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
        setIds((prev) => ({
            ...prev,
            mission: media.missionId,
        }));
    }, [media?.missionId, ids.mission, setIds]);

    // Sélection d'un média par défaut si mission sélectionnée sans
    useEffect(() => {
        if (ids.media !== undefined || !medias?.length) return;
        setIds((prev) => ({
            ...prev,
            media: medias[0].id,
        }));
    }, [medias, ids.media, setIds]);

    // Vérification de la sélection d'un traitement
    useEffect(() => {
        if (!lastTreatment || ids.treatment !== undefined) return;
        setIds((prev) => ({
            ...prev,
            treatment: lastTreatment.id,
        }));
    }, [lastTreatment, ids.treatment]);

    const value = useMemo(() => ({
        mission,
        media,
        treatment,
        medias,
        results,
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

export const useSelectionContext = () =>
    useContext(SelectionContext);

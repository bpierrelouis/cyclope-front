import { useState } from 'react';

import { NOTIFICATION_LABELS } from '../constants';
import { useSelectionContext } from '../contexts';
import { filesQueries, framesQueries, resultsQueries } from '../hooks';
import { openErrorToast, openSuccessToast } from '../utils';
import { BoxEditor } from '../views/treatment/BoxEditor.jsx';
import { ConfidenceBadges } from '../views/treatment/ConfidenceBadges.jsx';
import { Modal } from './Modal';

export function ResultPopup(props) {
    const { result: initial, dismiss } = props;
    const { source } = useSelectionContext();
    const timelineResult = source.timelineResults.find(({ result: item }) => item.id === initial.id);
    const result = timelineResult?.result ?? initial;
    const media = timelineResult?.media;

    // draft non nul = mode édition des rectangles de détection.
    const [draft, setDraft] = useState(null);
    const isEditing = draft !== null;

    const { data: legacySrc } = filesQueries.useGetContent(result.url);
    const { data: frameSrc } = framesQueries.useResultFrame(result, {
        enabled: !result.url,
        media,
    });
    const { data: rawSrc } = framesQueries.useResultFrame(result, {
        enabled: !result.url && isEditing,
        media,
        raw: true,
    });
    const viewSrc = result.url ? legacySrc : frameSrc;
    const editSrc = result.url ? legacySrc : rawSrc;

    const { isPending, mutate: updateResult } = resultsQueries.useUpdate();

    const hasUntyped = isEditing && draft.some((object) => !object.type);

    const save = () => updateResult(
        { data: { responseJson: { objects: draft } }, id: result.id },
        {
            onError: () => openErrorToast(NOTIFICATION_LABELS.RESULT_SAVE_ERROR),
            onSuccess: () => {
                openSuccessToast(NOTIFICATION_LABELS.RESULT_SAVED);
                setDraft(null);
            },
        },
    );

    const rows = [
        { label: 'Frame', value: result.index },
        { label: 'Latitude', value: result.coordinates?.latitude ?? '—' },
        { label: 'Longitude', value: result.coordinates?.longitude ?? '—' },
        { label: 'Altitude', value: result.altitudeLabel },
        { label: 'Vitesse', value: result.speedLabel },
    ];

    return (
        <Modal onClose={dismiss}>
            {(dialogElement) => (
                <div className='flex gap-4 p-4 w-3/4 max-w-7xl modal-box'>

                    <div className='flex-1 min-w-0'>
                        {isEditing ? (
                            editSrc
                                ? <BoxEditor src={editSrc} objects={draft} onChange={setDraft} dialogElement={dialogElement} />
                                : <div className='flex justify-center items-center bg-base-200 rounded-lg w-full aspect-video text-base-content/50'>Chargement…</div>
                        ) : (
                            viewSrc
                                ? <img src={viewSrc} alt='frame' className='rounded-lg w-full max-h-[70vh] object-contain' />
                                : <div className='flex justify-center items-center bg-base-200 rounded-lg w-full aspect-video text-base-content/50'>Pas d'image</div>
                        )}
                    </div>

                    <div className='flex flex-col self-start gap-3 w-2xs shrink-0'>
                        <dl className='rounded-box overflow-y-auto stats stats-vertical'>
                            {rows.map(({ label, value }) => (
                                <div key={label} className='px-4 py-2 stat'>
                                    <dt className='stat-title'>{label}</dt>
                                    <dd className='font-semibold tabular-nums text-base stat-value'>{value}</dd>
                                </div>
                            ))}
                            <div className='px-4 py-2 stat'>
                                <span className='stat-title'>Détection</span>
                                <div className='flex flex-wrap gap-1 stat-value'><ConfidenceBadges result={result} /></div>
                            </div>
                        </dl>

                        {isEditing ? (
                            <div className='flex flex-col gap-2'>
                                {hasUntyped && (
                                    <span className='text-warning text-xs'>Choisissez un type pour chaque rectangle.</span>
                                )}
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    disabled={hasUntyped || isPending}
                                    onClick={save}
                                >
                                    Enregistrer
                                </button>
                                <button type='button' className='btn btn-ghost btn-sm' onClick={() => setDraft(null)}>
                                    Annuler
                                </button>
                            </div>
                        ) : (
                            <button
                                type='button'
                                className='btn-outline btn btn-sm'
                                onClick={() => setDraft((result.objects ?? []).map((object) => ({ ...object })))}
                            >
                                Modifier les détections
                            </button>
                        )}
                    </div>

                </div>
            )}
        </Modal>
    );
}

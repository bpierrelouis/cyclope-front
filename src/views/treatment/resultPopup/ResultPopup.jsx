import { useState } from 'react';

import { Modal } from '../../../components';
import { NOTIFICATION_LABELS } from '../../../constants';
import { useSelectionContext } from '../../../contexts';
import { filesQueries, framesQueries, resultsQueries } from '../../../hooks';
import { openErrorToast } from '../../../utils';
import { BoxEditor } from './BoxEditor';
import { ResultPopupSidebar } from './ResultPopupSidebar';

export function ResultPopup(props) {
    const { result: initial, dismiss } = props;
    const { source } = useSelectionContext();
    const timelineResult = source.timelineResults.find(({ result: item }) => item.id === initial.id);
    const result = timelineResult?.result ?? initial;
    const media = timelineResult?.media;

    const [draft, setDraft] = useState(() =>
        (result.objects ?? []).map((object) => ({ ...object })),
    );

    const { data: legacySrc } = filesQueries.useGetContent(result.url);
    const { data: frameSrc } = framesQueries.useResultFrame(result, {
        enabled: !result.url,
        media,
    });
    const { data: rawSrc } = framesQueries.useResultFrame(result, {
        enabled: !result.url,
        media,
        raw: true,
    });
    const viewSrc = result.url ? legacySrc : frameSrc;
    const editSrc = result.url ? legacySrc : rawSrc;

    const { isPending, mutate: updateResult } = resultsQueries.useUpdate();

    const hasUntyped = draft.some((object) => !object.type);

    const save = (objects) => updateResult(
        { data: { responseJson: { objects } }, id: result.id },
        {
            onError: () => openErrorToast(NOTIFICATION_LABELS.RESULT_SAVE_ERROR),
        },
    );

    return (
        <Modal onClose={dismiss}>
            {(dialogElement) => (
                <div className='flex gap-4 p-4 w-3/4 max-w-7xl modal-box'>

                    <div className='flex-1 min-w-0'>
                        {editSrc
                            ? (
                                <BoxEditor
                                    src={editSrc}
                                    objects={draft}
                                    onChange={setDraft}
                                    onCommit={save}
                                    dialogElement={dialogElement}
                                />
                            )
                            : <div className='flex justify-center items-center bg-base-200 rounded-lg w-full aspect-video text-base-content/50'>Chargement…</div>}
                    </div>

                    <ResultPopupSidebar
                        hasUntyped={hasUntyped}
                        isPending={isPending}
                        result={result}
                        viewSrc={viewSrc}
                    />

                </div>
            )}
        </Modal>
    );
}

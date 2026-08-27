import { useState } from 'react';

import { Modal } from '../../../components';
import { NOTIFICATION_LABELS } from '../../../constants';
import { useSelectionContext } from '../../../contexts';
import { framesQueries, resultsQueries } from '../../../hooks';
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

    const { data: viewSrc } = framesQueries.useResultFrame(result, { media });
    const { data: rawSrc } = framesQueries.useResultFrame(result, {
        media,
        raw: true,
    });

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
                        {rawSrc ? (
                            <BoxEditor
                                src={rawSrc}
                                objects={draft}
                                onChange={setDraft}
                                onCommit={save}
                                dialogElement={dialogElement}
                            />
                        ) : (
                            <div className='flex justify-center items-center bg-base-200 rounded-lg w-full aspect-video text-base-content/50'>Chargement…</div>
                        )}
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

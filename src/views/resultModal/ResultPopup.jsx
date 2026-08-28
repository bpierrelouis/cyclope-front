import { useState } from 'react';

import { Modal } from '../../components';
import { NOTIFICATION_LABELS } from '../../constants';
import { useSelectionContext } from '../../contexts';
import { framesQueries, resultsQueries } from '../../hooks';
import { downloadDataUrl, openErrorToast } from '../../utils';
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
    const [isDownloading, setIsDownloading] = useState(false);

    const { data: rawSrc } = framesQueries.useFrame(result, media);

    const { isPending, mutate: updateResult } = resultsQueries.useUpdate();

    const hasUntyped = draft.some((object) => !object.type);

    const save = (objects) => updateResult(
        { data: { responseJson: { objects } }, id: result.id },
        {
            onError: () => openErrorToast(NOTIFICATION_LABELS.RESULT_SAVE_ERROR),
        },
    );

    const downloadDetectionFrame = async () => {
        setIsDownloading(true);
        try {
            const src = await framesQueries.createDetectionFrame(result, media);
            if (!src) return;

            downloadDataUrl(
                src,
                `detection-frame-${result.index ?? result.id}.jpg`,
            );
        } finally {
            setIsDownloading(false);
        }
    };

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
                        isDownloading={isDownloading}
                        isPending={isPending}
                        onDownload={downloadDetectionFrame}
                        result={result}
                    />

                </div>
            )}
        </Modal>
    );
}

import { ChevronDownIcon } from 'lucide-react';

import { DeleteButton } from '../../../components';
import { useMissionCreationStore } from '../../../stores';
import { formatFileSize } from '../../../utils';
import { FileConfig } from './FileConfig';

export function FileListItem(props) {
    const { file } = props;

    const deselect = useMissionCreationStore((state) => state.deselect);

    const handleRemove = () => deselect(file.id);

    return (
        <li className='block px-0 list-row'>
            <div className='flex items-start gap-1 text-sm'>
                <details className='group flex-1 min-w-0'>
                    <summary className='flex items-center gap-2 py-1.5 min-w-0 list-none cursor-pointer'>
                        <span className='flex-1 truncate'>{file.name}</span>
                        <span className='opacity-60'>
                            {formatFileSize(file.size)}
                        </span>
                        <ChevronDownIcon
                            className='opacity-60 size-4 transition-transform group-open:rotate-180 shrink-0'
                        />
                    </summary>
                    <div className='pb-2'>
                        <FileConfig file={file} />
                    </div>
                </details>
                <DeleteButton
                    aria-label={`Retirer ${file.name}`}
                    className='mt-1'
                    title={`Retirer ${file.name}`}
                    onClick={handleRemove}
                />
            </div>
        </li>
    );
}

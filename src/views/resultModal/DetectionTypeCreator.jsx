import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { iconSizes } from '../../constants';

export function DetectionTypeCreator({ onCreate }) {
    const [name, setName] = useState('');

    const submit = (event) => {
        event.preventDefault();
        const normalizedName = name.trim();
        if (!normalizedName) return;

        onCreate(normalizedName);
        setName('');
    };

    return (
        <div className='bg-base-200/60 p-2.5 border-base-300 border-t'>
            <p className='mb-1.5 px-0.5 font-medium text-xs text-base-content/60'>
                Créer un nouveau type
            </p>
            <form className='flex gap-1.5' onSubmit={submit}>
                <input
                    className='flex-1 bg-base-100 min-w-0 input input-bordered input-sm'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Nom du type…'
                    aria-label='Nom de la nouvelle détection'
                />
                <button
                    type='submit'
                    className='btn btn-primary btn-sm btn-square'
                    disabled={!name.trim()}
                    title='Ajouter et sélectionner'
                    aria-label='Ajouter et sélectionner la détection'
                >
                    <PlusIcon size={iconSizes.sm} />
                </button>
            </form>
        </div>
    );
}

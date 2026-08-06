import { Columns3Icon } from 'lucide-react';
import { iconSizes } from '../../../constants';
import { useTableStore } from '../../../stores';
import { getColumnOptions } from './columnDefs';
import { SelectionMenu } from './SelectionMenu';

const COLUMN_OPTIONS = getColumnOptions().map(({ field, headerName }) => ({
    value: field,
    label: headerName,
}));

// Menu de visibilité des colonnes.
export function ColumnsMenu() {
    const { hiddenColumnIds, toggleColumn, showAllColumns } = useTableStore();

    return (
        <div className='dropdown-bottom dropdown'>
            <button
                type='button'
                tabIndex={0}
                className='btn btn-ghost'
            >
                <Columns3Icon size={iconSizes.sm} />
                Colonnes
                {hiddenColumnIds.length > 0 && (
                    <span className='badge badge-sm'>{hiddenColumnIds.length}</span>
                )}
            </button>

            <div
                tabIndex={0}
                className='z-30 shadow-lg mt-2 border border-base-300 rounded-box w-52 dropdown-content'
            >
                <SelectionMenu
                    options={COLUMN_OPTIONS}
                    selectedValues={COLUMN_OPTIONS
                        .map(({ value }) => value)
                        .filter((value) => !hiddenColumnIds.includes(value))}
                    onToggle={toggleColumn}
                    resetLabel='Tout afficher'
                    onReset={showAllColumns}
                    alwaysShowReset={true}
                    className='rounded-box'
                />
            </div>
        </div>
    );
}

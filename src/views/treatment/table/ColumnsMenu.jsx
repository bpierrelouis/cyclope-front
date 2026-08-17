import { Columns3Icon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { iconSizes } from '../../../constants';
import { useSelectionContext } from '../../../contexts';
import { useTableStore } from '../../../stores';
import { getColumnOptions } from './columnDefs';
import { SelectionMenu } from './SelectionMenu';

// Menu de visibilité des colonnes.
export function ColumnsMenu() {
    const { isMission } = useSelectionContext();
    const { hiddenColumnIds, toggleColumn, showAllColumns } = useTableStore(useShallow((state) => ({
        hiddenColumnIds: state.hiddenColumnIds,
        showAllColumns: state.showAllColumns,
        toggleColumn: state.toggleColumn,
    })));
    const columnOptions = getColumnOptions(isMission).map(({ id, headerName }) => ({
        label: headerName,
        value: id,
    }));
    const hiddenColumnCount = columnOptions.filter(
        ({ value }) => hiddenColumnIds.includes(value),
    ).length;

    return (
        <div className='dropdown-bottom dropdown'>
            <button
                type='button'
                tabIndex={0}
                className='btn btn-ghost'
            >
                <Columns3Icon size={iconSizes.sm} />
                Colonnes
                {hiddenColumnCount > 0 && (
                    <span className='badge badge-sm'>{hiddenColumnCount}</span>
                )}
            </button>

            <div
                tabIndex={0}
                className='z-30 shadow-lg mt-2 border border-base-300 rounded-box w-52 dropdown-content'
            >
                <SelectionMenu
                    options={columnOptions}
                    selectedValues={columnOptions
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

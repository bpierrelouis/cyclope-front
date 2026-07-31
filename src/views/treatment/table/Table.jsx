import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePlayerStore } from '../../../stores';
import { cn, getCurrentResult, sendOpenStateToMaster } from '../../../utils';
import { DetectionCell } from './DetectionsCell';
import { FrameCell } from './FrameCell';
import { ResultPopup } from '../ResultPopup';

export function Table() {
    const { isMaster, results, currentTime } = usePlayerStore();
    const [selected, setSelected] = useState(null);
    const activeRowRef = useRef(null);

    const currentResultId = useMemo(
        () => getCurrentResult(results, currentTime)?.id ?? null,
        [results, currentTime],
    );

    const columns = useMemo(() => [
        {
            accessorKey: 'url',
            header: 'Image',
            cell: ({ row }) => (<FrameCell row={row} onClick={setSelected} />),
        },
        { accessorKey: 'index', header: 'Frame' },
        { accessorKey: 'timecode', header: 'Timecode' },
        { accessorKey: 'coordinates.latitude', header: 'Latitude' },
        { accessorKey: 'coordinates.longitude', header: 'Longitude' },
        { accessorKey: 'altitudeLabel', header: 'Altitude' },
        { accessorKey: 'speedLabel', header: 'Vitesse' },
        {
            accessorKey: 'objects',
            header: 'Détection',
            cell: DetectionCell,
        },
    ], [setSelected]);

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isTableOpen');
    }, [isMaster]);

    useEffect(() => {
        activeRowRef.current?.scrollIntoView({ block: 'nearest' });
    }, [currentResultId]);

    const table = useReactTable({
        data: results ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className='flex gap-4 h-full'>
            <div className='flex-1 overflow-auto'>
                <table className='table table-sm table-zebra w-full'>
                    <TableHead table={table} />
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <TableBodyRow
                                key={row.id}
                                row={row}
                                selectedId={currentResultId}
                                selectedRef={activeRowRef}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (<ResultPopup result={selected} dismiss={() => setSelected(null)} />)}
        </div>
    );
}

function TableHead(props) {
    const { table } = props;

    return (
        <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <TableHeadCell key={header.id} header={header} />
                    ))}
                </tr>
            ))}
        </thead>
    );
}

function TableHeadCell(props) {
    const { header } = props;
    const isSorted = header.column.getIsSorted();
    const sortAddon = { 'asc': ' ↑', 'desc': ' ↓' }[isSorted];

    return (
        <th
            key={header.id}
            className='cursor-pointer select-none'
            onClick={header.column.getToggleSortingHandler()}
        >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {sortAddon}
        </th>
    );
}

function TableBodyRow(props) {
    const { row, selectedId, selectedRef } = props;
    const isActive = row.original.id === selectedId;

    return (
        <tr
            key={row.id}
            ref={isActive ? selectedRef : null}
            className={cn(isActive && '*:bg-primary/20')}
        >
            {row.getVisibleCells().map(cell => (
                <TableBodyCell key={cell.id} cell={cell} />
            ))}
        </tr>
    );
}

function TableBodyCell(props) {
    const { cell } = props;

    return (
        <td key={cell.id} >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
    );
}

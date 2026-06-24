import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { usePlayerStore } from '../../../stores';
import { sendOpenStateToMaster } from '../../../utils';
import { DetectionCell } from './DetectionsCell';
import { FrameCell } from './FrameCell';
import { ResultPopup } from './ResultPopup';

export function Table() {
    const { isMaster, results } = usePlayerStore();
    const [selected, setSelected] = useState(null);

    const columns = useMemo(() => [
        {
            accessorKey: 'url',
            header: 'Image',
            cell: ({ row }) => (
                <FrameCell url={row.original.url} onClick={() => setSelected(row.original)} />
            ),
        },
        { accessorKey: 'index', header: 'Frame' },
        {
            accessorFn: (row) => row.timeStamp?.split('.')[0],
            id: 'timestamp',
            header: 'Timecode',
        },
        { accessorKey: 'coordinates.latitude', header: 'Latitude' },
        { accessorKey: 'coordinates.longitude', header: 'Longitude' },
        {
            accessorFn: (row) => `${row.altitude.value} ${row.altitude.unit}`,
            id: 'altitude',
            header: 'Altitude',
        },
        {
            accessorFn: (row) => `${row.speed.value} ${row.speed.unit}`,
            id: 'speed',
            header: 'Vitesse',
        },
        {
            accessorKey: 'objects',
            header: 'Détection',
            cell: ({ row }) => (
                <DetectionCell result={row.original} />
            ),
        },
    ], [setSelected]);

    useEffect(() => {
        if (isMaster) return;
        return sendOpenStateToMaster('isTableOpen');
    }, [isMaster]);

    const table = useReactTable({
        data: results ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className='flex gap-4 h-full'>
            <div className='flex-1 overflow-x-auto'>
                <table className='table table-sm table-zebra w-full'>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className='cursor-pointer select-none'
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getIsSorted() === 'asc' ? ' ↑'
                                            : header.column.getIsSorted() === 'desc' ? ' ↓'
                                                : ''}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (<ResultPopup result={selected} dismiss={() => setSelected(null)} />)}
        </div>
    );
}

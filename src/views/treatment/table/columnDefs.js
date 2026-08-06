import { DETECTION_FORMAT_MESSAGE } from '../../../constants';
import { fromText, isValidLatitude, isValidLongitude, toText } from '../../../utils';
import { DetectionFilter } from './DetectionFilter';
import { DetectionCell } from './DetectionsCell';
import { FavoriteCell } from './FavoriteCell';
import { FavoriteHeader } from './FavoriteHeader';
import { FrameCell } from './FrameCell';

const EmptyFilter = () => null;

const parseNumber = (validate = () => true) => (raw) => {
    if (typeof raw === 'string' && raw.trim() === '') return null;
    const value = Number(raw);
    return Number.isFinite(value) && validate(value) ? value : null;
};

const editableColumn = (parse, createPatch, errorMessage, isEditable = true) => ({
    editable: isEditable,
    context: { edit: { parse, createPatch, errorMessage } },
});

const measurementColumn = ({ field, key, headerName, validate, errorMessage }) => ({
    field,
    headerName,
    valueFormatter: ({ data: result }) => result[`${key}Label`] ?? '—',
    ...editableColumn(
        parseNumber(validate),
        (result, value) => ({ [key]: { ...result.data[key], value } }),
        errorMessage,
        ({ data: result }) => Boolean(result.data[key]),
    ),
});

/**
 * Colonne de favoris
 */
const FAVORITE_COLUMN = {
    field: 'isFavorite',
    headerComponent: FavoriteHeader,
    editable: false,
    sortable: false,
    resizable: false,
    pinned: 'left',
    flex: 0,
    width: 52,
    minWidth: 52,
    maxWidth: 52,
    cellRenderer: FavoriteCell,
    filter: {
        component: EmptyFilter,
        doesFilterPass: ({ data }) => data.isFavorite,
    },
    suppressHeaderMenuButton: true,
    context: { isControlColumn: true },
};


export const getColumnDefs = (onImageClick) => [
    FAVORITE_COLUMN,
    {
        field: 'url',
        headerName: 'Image',
        editable: false,
        sortable: false,
        cellRenderer: FrameCell,
        cellRendererParams: { onClick: onImageClick },
    },
    {
        field: 'index',
        headerName: 'Frame',
        editable: false,
    },
    {
        field: 'timecode',
        headerName: 'Timecode',
        editable: false,
    },
    {
        field: 'coordinates.latitude',
        headerName: 'Latitude',
        ...editableColumn(
            parseNumber(isValidLatitude),
            (result, value) => ({ acft: { ...result.data.acft, latitude: value } }),
            'La latitude doit être comprise entre -90 et 90',
        ),
    },
    {
        field: 'coordinates.longitude',
        headerName: 'Longitude',
        ...editableColumn(
            parseNumber(isValidLongitude),
            (result, value) => ({ acft: { ...result.data.acft, longitude: value } }),
            'La longitude doit être comprise entre -180 et 180',
        ),
    },
    measurementColumn({
        field: 'data.altitude.value',
        key: 'altitude',
        headerName: 'Altitude',
        errorMessage: 'Valeur invalide',
    }),
    measurementColumn({
        field: 'data.speed.value',
        key: 'speed',
        headerName: 'Vitesse',
        validate: (value) => value >= 0,
        errorMessage: 'La vitesse doit être positive',
    }),
    {
        field: 'objects',
        headerName: 'Détection',
        cellRenderer: DetectionCell,
        ...editableColumn(
            fromText,
            (_result, objects) => ({ objects }),
            DETECTION_FORMAT_MESSAGE,
        ),
        filter: {
            component: DetectionFilter,
            doesFilterPass: ({ model, node }) => {
                const selectedTypes = model?.values ?? [];
                const resultTypes = node.data.objects?.map(({ type }) => type) ?? [];
                return selectedTypes.some((type) => resultTypes.includes(type));
            },
        },
        suppressHeaderMenuButton: false,
        suppressHeaderFilterButton: false,
        valueGetter: ({ data: result }) => toText(result.objects),
    },
];


export const getColumnOptions = () =>
    getColumnDefs()
        .filter(({ context }) => !context?.isControlColumn)
        .map(({ field, headerName }) => ({ field, headerName }));

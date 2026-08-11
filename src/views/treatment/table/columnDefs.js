import { isValidLatitude, isValidLongitude, toText } from '../../../utils';
import { DetectionCellEditor } from './DetectionCellEditor';
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

const editableColumn = (
    parse,
    createPatch,
    errorMessage,
    isEditable = true,
    isEqual = (left, right) => left === right,
) => ({
    context: {
        edit: {
            createPatch, errorMessage, isEqual, parse,
        },
    },
    editable: isEditable,
});

const areSameDetections = (left = [], right = []) => {
    const signature = (objects) => objects
        .map(({ type, confidence }) => `${type}\u0000${confidence}`)
        .sort();
    return JSON.stringify(signature(left)) === JSON.stringify(signature(right));
};

const measurementColumn = ({
    field, key, headerName, validate, errorMessage,
}) => ({
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
    cellRenderer: FavoriteCell,
    context: { isControlColumn: true },
    editable: false,
    field: 'isFavorite',
    filter: {
        component: EmptyFilter,
        doesFilterPass: ({ data }) => data.isFavorite,
    },
    flex: 0,
    headerComponent: FavoriteHeader,
    maxWidth: 52,
    minWidth: 52,
    pinned: 'left',
    resizable: false,
    sortable: false,
    suppressHeaderMenuButton: true,
    width: 52,
};


export const getColumnDefs = (onImageClick) => [
    FAVORITE_COLUMN,
    {
        cellRenderer: FrameCell,
        cellRendererParams: { onClick: onImageClick },
        editable: false,
        field: 'url',
        headerName: 'Image',
        sortable: false,
    },
    {
        editable: false,
        field: 'index',
        headerName: 'Frame',
    },
    {
        editable: false,
        field: 'timecode',
        headerName: 'Timecode',
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
        errorMessage: 'Valeur invalide',
        field: 'data.altitude.value',
        headerName: 'Altitude',
        key: 'altitude',
    }),
    measurementColumn({
        errorMessage: 'La vitesse doit être positive',
        field: 'data.speed.value',
        headerName: 'Vitesse',
        key: 'speed',
        validate: (value) => value >= 0,
    }),
    {
        autoHeight: true,
        cellEditor: DetectionCellEditor,
        cellEditorPopup: true,
        cellEditorPopupPosition: 'under',
        cellRenderer: DetectionCell,
        field: 'objects',
        headerName: 'Détection',
        ...editableColumn(
            (objects) => objects,
            (_result, objects) => ({ objects }),
            'Sélection invalide',
            true,
            areSameDetections,
        ),
        filter: {
            component: DetectionFilter,
            doesFilterPass: ({ model, node }) => {
                const selectedTypes = model?.values ?? [];
                const resultTypes = node.data.objects?.map(({ type }) => type) ?? [];
                return selectedTypes.some((type) => resultTypes.includes(type));
            },
        },
        suppressHeaderFilterButton: false,
        valueFormatter: ({ value }) => toText(value),
    },
];


export const getColumnOptions = () =>
    getColumnDefs()
        .filter(({ context }) => !context?.isControlColumn)
        .map(({ field, headerName }) => ({ field, headerName }));

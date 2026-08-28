import { NUMBER_FILTER_OPTIONS, TEXT_FILTER_OPTIONS } from '../../../constants';
import {
    formatTimecode,
    getFieldValue,
    isValidLatitude,
    isValidLongitude,
    normalizeNumericFilterValue,
    parseMeasurement,
    toText,
} from '../../../utils';
import { DetectionFilter } from './DetectionFilter';
import { DetectionCell } from './DetectionsCell';
import { FavoriteCell } from './FavoriteCell';
import { FavoriteHeader } from './FavoriteHeader';
import { FrameCell } from './FrameCell';

const EmptyFilter = () => null;

const numberFilter = (field) => ({
    filter: 'agNumberColumnFilter',
    filterParams: {
        filterOptions: NUMBER_FILTER_OPTIONS,
        maxNumConditions: 1,
    },
    filterValueGetter: ({ data }) =>
        normalizeNumericFilterValue(getFieldValue(data, field)),
});

const TEXT_FILTER = {
    filter: 'agTextColumnFilter',
    filterParams: {
        filterOptions: TEXT_FILTER_OPTIONS,
        maxNumConditions: 1,
    },
};

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

const measurementColumn = ({
    field, key, headerName, validate, errorMessage,
}) => ({
    cellDataType: false,
    comparator: (left, right) => {
        const leftValue = parseMeasurement(left)?.value;
        const rightValue = parseMeasurement(right)?.value;
        if (leftValue == null) return rightValue == null ? 0 : -1;
        if (rightValue == null) return 1;
        return leftValue - rightValue;
    },
    field,
    ...numberFilter(field),
    headerName,
    valueFormatter: ({ value }) => value ?? '—',
    valueGetter: ({ data: result }) => result[`${key}Label`] ?? null,
    ...editableColumn(
        (raw) => parseMeasurement(raw, validate),
        (result, measurement) => result.createAircraftMeasurementPatch(key, measurement),
        errorMessage,
        true,
        (left, right) => left.value === right.value && left.unit === right.unit,
    ),
});

/**
 * Colonne de favoris
 */
const FAVORITE_COLUMN = {
    cellRenderer: FavoriteCell,
    context: { isControlColumn: true, suppressRowNavigation: true },
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


export const getColumnDefs = (
    onImageClick,
    timelineResultsById = new Map(),
    isMission = false,
) => [
    FAVORITE_COLUMN,
    ...(isMission ? [{
        editable: false,
        field: 'mediaName',
        headerName: 'Vidéo',
        valueGetter: ({ data }) => timelineResultsById.get(data.id)?.media.name,
    }] : []),
    {
        cellRenderer: FrameCell,
        cellRendererParams: { onClick: onImageClick, timelineResultsById },
        context: { suppressRowNavigation: true },
        editable: false,
        field: 'url',
        headerName: 'Image',
        sortable: false,
    },
    {
        editable: false,
        field: 'index',
        ...numberFilter('index'),
        headerName: 'Frame',
    },
    {
        colId: 'timecode',
        editable: false,
        ...TEXT_FILTER,
        filterValueGetter: ({ data }) => {
            const globalTime = timelineResultsById.get(data.id)?.globalTime;
            return globalTime == null ? null : formatTimecode(globalTime);
        },
        headerName: 'Timecode',
        valueFormatter: ({ value }) => value === null ? '—' : formatTimecode(value),
        valueGetter: ({ data }) => timelineResultsById.get(data.id)?.globalTime ?? null,
    },
    {
        field: 'latitudeValue',
        ...numberFilter('latitudeValue'),
        headerName: 'Latitude',
        ...editableColumn(
            parseNumber(isValidLatitude),
            (result, value) => result.createAircraftCoordinatePatch('latitude', value),
            'La latitude doit être comprise entre -90 et 90',
        ),
    },
    {
        field: 'longitudeValue',
        ...numberFilter('longitudeValue'),
        headerName: 'Longitude',
        ...editableColumn(
            parseNumber(isValidLongitude),
            (result, value) => result.createAircraftCoordinatePatch('longitude', value),
            'La longitude doit être comprise entre -180 et 180',
        ),
    },
    measurementColumn({
        errorMessage: 'Saisissez une valeur, avec une unité facultative (ex. 120 ou 120 m)',
        field: 'altitudeValue',
        headerName: 'Altitude',
        key: 'altitude',
    }),
    measurementColumn({
        errorMessage: 'Saisissez une vitesse positive, avec une unité facultative (ex. 95 ou 95 km/h)',
        field: 'speedValue',
        headerName: 'Vitesse',
        key: 'speed',
        validate: (value) => value >= 0,
    }),
    {
        autoHeight: true,
        cellRenderer: DetectionCell,
        editable: false,
        field: 'objects',
        filter: {
            component: DetectionFilter,
            doesFilterPass: ({ model, node }) => {
                const selectedTypes = model?.values ?? [];
                const resultTypes = node.data.objects?.map(({ type }) => type) ?? [];
                return selectedTypes.some((type) => resultTypes.includes(type));
            },
        },
        headerName: 'Détection',
        suppressHeaderFilterButton: false,
        valueFormatter: ({ value }) => toText(value),
    },
];


export const getColumnOptions = (isMission = false) =>
    getColumnDefs(undefined, undefined, isMission)
        .filter(({ context }) => !context?.isControlColumn)
        .map(({ colId, field, headerName }) => ({ headerName, id: colId ?? field }));

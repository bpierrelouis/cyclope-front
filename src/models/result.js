import { parseTimecode } from '../utils/treatment';

const DEFAULT_CONFIDENCE = 100;

const isDefined = (value) => value !== null && value !== undefined;

const toMeasurement = (candidate) => {
    if (!candidate || typeof candidate !== 'object') return null;

    const { value } = candidate;
    if (!isDefined(value)) return null;

    return {
        confidence: candidate.confidence ?? null,
        unit: candidate.unit ?? null,
        value,
    };
};

const getMeasurementEntries = (rawMeasurement) => {
    const candidates = Array.isArray(rawMeasurement)
        ? rawMeasurement
        : [rawMeasurement];

    return candidates
        .map((candidate, index) => ({ index, measurement: toMeasurement(candidate) }))
        .filter(({ measurement }) => measurement !== null);
};

const confidenceScore = ({ confidence }) =>
    Number.isFinite(confidence) ? confidence : -Infinity;

const selectMeasurementEntry = (rawMeasurement) =>
    getMeasurementEntries(rawMeasurement).reduce(
        (selected, candidate) => !selected
            || confidenceScore(candidate.measurement) > confidenceScore(selected.measurement)
            ? candidate
            : selected,
        null,
    );

const formatMeasurement = (measurement) => {
    if (!measurement) return null;
    return [measurement.value, measurement.unit]
        .filter(isDefined)
        .join(' ');
};

const updateMeasurementValue = (rawMeasurement, value) => {
    const candidates = Array.isArray(rawMeasurement) ? rawMeasurement : [];
    const selected = selectMeasurementEntry(candidates);

    if (!selected) {
        return [{ confidence: DEFAULT_CONFIDENCE, value }];
    }

    return candidates.map((candidate, index) => index === selected.index
        ? { ...candidate, value }
        : candidate);
};

const getCoordinateValue = (container, axis) => {
    return toMeasurement(container?.coordinate?.[axis])?.value ?? null;
};

const isCoordinateValueValid = (axis, value) => Number.isFinite(value)
    && (axis === 'latitude'
        ? value >= -90 && value <= 90
        : value >= -180 && value <= 180);

export class Result {
    constructor(data) {
        this.meta = data;
    }

    static mapper(data) {
        return new Result(data);
    }

    get id() {
        return this.meta.id;
    }

    get treatmentId() {
        return this.meta.treatmentId;
    }

    get index() {
        return this.meta.index ?? this.data.frameIndex;
    }

    get data() {
        return this.meta.responseJson ?? {};
    }

    get isFavorite() {
        return !!this.meta.isFavorite;
    }

    get altitudeLabel() {
        return formatMeasurement(this.getAircraftMeasurement('altitude'));
    }

    get altitudeValue() {
        return this.getAircraftMeasurement('altitude')?.value ?? null;
    }

    get latitudeValue() {
        return this.getAircraftCoordinateValue('latitude');
    }

    get longitudeValue() {
        return this.getAircraftCoordinateValue('longitude');
    }

    get seconds() {
        return Number.isFinite(this.data.timestampSeconds)
            ? this.data.timestampSeconds
            : parseTimecode(this.data.timestamp);
    }

    get speedLabel() {
        return formatMeasurement(this.getAircraftMeasurement('speed'));
    }

    get speedValue() {
        return this.getAircraftMeasurement('speed')?.value ?? null;
    }

    get objects() {
        return this.data.objects ?? [];
    }

    get coordinates() {
        const latitude = this.latitudeValue;
        const longitude = this.longitudeValue;
        return latitude !== null && longitude !== null
            ? { latitude, longitude }
            : null;
    }

    get target() {
        const latitude = this.getCoordinateValue('target', 'latitude');
        const longitude = this.getCoordinateValue('target', 'longitude');
        return latitude !== null && longitude !== null
            ? { latitude, longitude }
            : null;
    }

    get isFreezing() {
        return this.data.metaData?.isFreezing ?? false;
    }

    getAircraftCoordinateValue(axis) {
        return this.getCoordinateValue('aircraft', axis);
    }

    getAircraftMeasurement(key) {
        return selectMeasurementEntry(this.data.aircraft?.[key])?.measurement ?? null;
    }

    getCoordinateValue(containerKey, axis) {
        const value = getCoordinateValue(this.data[containerKey], axis);
        return isCoordinateValueValid(axis, value) ? value : null;
    }

    hasAircraftMeasurement(key) {
        return this.getAircraftMeasurement(key) !== null;
    }

    createAircraftCoordinatePatch(axis, value) {
        const aircraft = this.data.aircraft ?? {};
        const coordinate = aircraft.coordinate ?? {};
        const current = coordinate[axis] ?? {};

        return {
            aircraft: {
                ...aircraft,
                coordinate: {
                    ...coordinate,
                    [axis]: {
                        ...current,
                        confidence: Number.isFinite(current.confidence)
                            ? current.confidence
                            : DEFAULT_CONFIDENCE,
                        value,
                    },
                },
            },
        };
    }

    createAircraftMeasurementPatch(key, value) {
        const aircraft = this.data.aircraft ?? {};
        return {
            aircraft: {
                ...aircraft,
                [key]: updateMeasurementValue(aircraft[key], value),
            },
        };
    }
}

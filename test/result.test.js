import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import { Result } from '../src/models/result.js';
import { convertKeysFromSnakeToCamelCase } from '../src/utils/request.js';

const createResult = (responseJson, meta = {}) => new Result({
    id: 1,
    index: responseJson.frameIndex,
    responseJson,
    ...meta,
});

describe('Result', () => {
    it('selects the measurement with the highest numeric confidence', () => {
        const result = createResult({
            aircraft: {
                altitude: [
                    { confidence: null, unit: 'm', value: 90 },
                    { confidence: 98, unit: 'm', value: 125 },
                    { confidence: 60, unit: 'm', value: 110 },
                ],
            },
            frameIndex: 4,
        });

        assert.equal(result.altitudeValue, 125);
        assert.equal(result.altitudeLabel, '125 m');
    });

    it('keeps the first usable candidate when confidences are unavailable', () => {
        const result = createResult({
            aircraft: {
                speed: [
                    { confidence: null, value: null },
                    { confidence: null, unit: 'km/h', value: 82 },
                    { confidence: null, unit: 'km/h', value: 84 },
                ],
            },
            frameIndex: 7,
        });

        assert.equal(result.speedValue, 82);
        assert.equal(result.speedLabel, '82 km/h');
    });

    it('exposes partial axes individually but only builds valid complete coordinates', () => {
        const partial = createResult({
            aircraft: {
                coordinate: { latitude: { confidence: 90, value: 48.5 } },
            },
            frameIndex: 1,
        });
        const invalid = createResult({
            aircraft: {
                coordinate: {
                    latitude: { confidence: 90, value: 48.5 },
                    longitude: { confidence: 90, value: 21500425 },
                },
            },
            frameIndex: 2,
        });

        assert.equal(partial.latitudeValue, 48.5);
        assert.equal(partial.longitudeValue, null);
        assert.equal(partial.coordinates, null);
        assert.equal(invalid.longitudeValue, null);
        assert.equal(invalid.coordinates, null);
    });

    it('updates only the selected measurement candidate', () => {
        const result = createResult({
            aircraft: {
                speed: [
                    { confidence: 70, unit: 'km/h', value: 80 },
                    { confidence: 99, unit: 'km/h', value: 90 },
                ],
                voltage: [{ confidence: 95, unit: 'V', value: 14.5 }],
            },
            frameIndex: 3,
        });

        assert.deepEqual(result.createAircraftMeasurementPatch('speed', 95), {
            aircraft: {
                speed: [
                    { confidence: 70, unit: 'km/h', value: 80 },
                    { confidence: 99, unit: 'km/h', value: 95 },
                ],
                voltage: [{ confidence: 95, unit: 'V', value: 14.5 }],
            },
        });
    });

    it('creates a coordinate axis without discarding the other aircraft data', () => {
        const result = createResult({
            aircraft: {
                altitude: [{ confidence: 98, value: 120 }],
                coordinate: { latitude: { confidence: 92, value: 48.5 } },
            },
            frameIndex: 5,
        });

        assert.deepEqual(result.createAircraftCoordinatePatch('longitude', 2.2), {
            aircraft: {
                altitude: [{ confidence: 98, value: 120 }],
                coordinate: {
                    latitude: { confidence: 92, value: 48.5 },
                    longitude: { confidence: 100, value: 2.2 },
                },
            },
        });
    });

    it('reads every response from the documented data sample', () => {
        const source = JSON.parse(readFileSync(
            new URL('../docs/AI_RESULTS.json', import.meta.url),
            'utf8',
        ));
        const results = convertKeysFromSnakeToCamelCase(source)
            .map((responseJson) => createResult(responseJson));
        const frame56 = results.find(({ index }) => index === 56);
        const frame53 = results.find(({ index }) => index === 53);

        assert.equal(results.length, 75);
        assert.equal(frame56.altitudeValue, 324.1);
        assert.equal(frame56.speedValue, 99.8);
        assert.deepEqual(frame56.coordinates, {
            latitude: 49.261475,
            longitude: 2.490784,
        });
        assert.equal(frame53.longitudeValue, null);
        assert.equal(frame53.coordinates, null);
    });
});

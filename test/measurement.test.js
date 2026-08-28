import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseMeasurement } from '../src/utils/measurement.js';

describe('measurement helpers', () => {
    it('separates a numeric value from its unit', () => {
        assert.deepEqual(parseMeasurement('95.5 km/h'), {
            unit: 'km/h',
            value: 95.5,
        });
        assert.deepEqual(parseMeasurement(' 120,25 m '), {
            unit: 'm',
            value: 120.25,
        });
        assert.deepEqual(parseMeasurement('120'), {
            unit: null,
            value: 120,
        });
    });

    it('accepts an optional unit and applies numeric validation', () => {
        assert.equal(parseMeasurement('km/h'), null);
        assert.equal(parseMeasurement('-5 km/h', (value) => value >= 0), null);
        assert.equal(parseMeasurement('-5', (value) => value >= 0), null);
    });
});

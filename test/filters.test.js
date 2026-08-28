import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
    filterResultsLikeTable,
    getFieldValue,
    normalizeNumericFilterValue,
    resultPassesTableFilters,
} from '../src/utils/filters.js';

const result = {
    coordinates: { latitude: 48.5, longitude: 2.2 },
    data: {
        altitude: { value: 120 },
        speed: { value: 80 },
    },
    id: 1,
    index: 42,
    isFavorite: true,
    objects: [{ type: 'car' }, { type: 'person' }],
    timecode: '00:01:25',
};

const numberModel = (type, filter, filterTo) => ({
    filter,
    filterTo,
    filterType: 'number',
    type,
});

describe('table filter helpers', () => {
    it('reads nested values safely', () => {
        assert.equal(getFieldValue(result, 'data.altitude.value'), 120);
        assert.equal(getFieldValue(result, 'data.missing.value'), undefined);
    });

    it('normalizes empty numeric values', () => {
        assert.equal(normalizeNumericFilterValue(''), null);
        assert.equal(normalizeNumericFilterValue('   '), null);
        assert.equal(normalizeNumericFilterValue('invalid'), null);
        assert.equal(normalizeNumericFilterValue('12.5'), 12.5);
        assert.equal(normalizeNumericFilterValue(0), 0);
    });

    it('applies every supported number filter', () => {
        assert.equal(resultPassesTableFilters(result, {
            index: numberModel('equals', 42),
        }), true);
        assert.equal(resultPassesTableFilters(result, {
            index: numberModel('greaterThan', 42),
        }), false);
        assert.equal(resultPassesTableFilters(result, {
            index: numberModel('lessThan', 43),
        }), true);
        assert.equal(resultPassesTableFilters(result, {
            index: numberModel('inRange', 41, 43),
        }), true);
    });

    it('keeps AG Grid in-range bounds exclusive by default', () => {
        assert.equal(resultPassesTableFilters(result, {
            index: numberModel('inRange', 42, 43),
        }), false);
    });

    it('applies case-insensitive text filters', () => {
        assert.equal(resultPassesTableFilters(result, {
            timecode: { filter: '01:2', filterType: 'text', type: 'contains' },
        }), true);
    });

    it('rejects missing and empty numeric values', () => {
        const model = { index: numberModel('equals', 0) };
        assert.equal(resultPassesTableFilters({ ...result, index: null }, model), false);
        assert.equal(resultPassesTableFilters({ ...result, index: '' }, model), false);
        assert.equal(resultPassesTableFilters({ ...result, index: 'invalid' }, model), false);
    });

    it('combines favorite, detection and standard filters', () => {
        const model = {
            index: numberModel('equals', 42),
            isFavorite: { filterType: 'isFavorite', value: true },
            objects: { filterType: 'detection', values: ['person'] },
        };
        assert.equal(resultPassesTableFilters(result, model), true);
        assert.equal(resultPassesTableFilters({ ...result, isFavorite: false }, model), false);
        assert.equal(resultPassesTableFilters({ ...result, objects: [] }, model), false);
    });

    it('filters result collections like the table', () => {
        const results = [result, { ...result, id: 2, index: 7 }];
        assert.deepEqual(
            filterResultsLikeTable(results, { index: numberModel('greaterThan', 10) }),
            [result],
        );
    });
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatTime } from '../src/utils/labels.js';

describe('formatTime', () => {
    it('formats a short duration as mm:ss', () => {
        assert.equal(formatTime(754), '12:34');
    });

    it('formats all parts as hh:mm:ss when hours are displayed', () => {
        assert.equal(formatTime(754, true), '00:12:34');
        assert.equal(formatTime(4334, true), '01:12:14');
    });
});

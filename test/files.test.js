import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ACCEPTED_CARTO_EXTENSIONS } from '../src/constants/files.js';
import {
    getRelativeFilePath,
    getRootFolderName,
    isFilesInXyzFolder,
    joinPath,
} from '../src/utils/files.js';

const xyzFile = (relativePath) => ({
    name: relativePath.split('/').at(-1),
    relativePath,
});

describe('file helpers', () => {
    it('joins normalized path segments', () => {
        assert.equal(joinPath('/carto/', '', '/folder', 'map.pmtiles'), 'carto/folder/map.pmtiles');
    });

    it('keeps standalone cartography formats separate from XYZ tiles', () => {
        assert.deepEqual(
            ACCEPTED_CARTO_EXTENSIONS,
            ['pmtiles', 'geojson', 'geo.json', 'json'],
        );
    });

    it('reads browser and synthetic relative paths', () => {
        assert.equal(getRelativeFilePath({ name: 'map.pmtiles' }), 'map.pmtiles');
        assert.equal(
            getRelativeFilePath({ name: '0.png', webkitRelativePath: 'map/1/2/0.png' }),
            'map/1/2/0.png',
        );
        assert.equal(
            getRelativeFilePath(xyzFile('map/1/2/0.png')),
            'map/1/2/0.png',
        );
    });

    it('recognizes a valid XYZ folder', () => {
        const files = [
            xyzFile('paris/0/0/0.png'),
            xyzFile('paris/1/0/0.png'),
            xyzFile('paris/1/1/0.png'),
        ];

        assert.equal(isFilesInXyzFolder(files), true);
        assert.equal(getRootFolderName(files), 'paris');
    });

    it('rejects malformed or mixed XYZ folders', () => {
        assert.equal(isFilesInXyzFolder([xyzFile('paris/0/0.png')]), false);
        assert.equal(isFilesInXyzFolder([xyzFile('paris/a/0/0.png')]), false);
        assert.equal(isFilesInXyzFolder([xyzFile('paris/0/0/0.jpg')]), false);
        assert.equal(isFilesInXyzFolder([
            xyzFile('paris/0/0/0.png'),
            xyzFile('lyon/0/0/0.png'),
        ]), false);
    });
});

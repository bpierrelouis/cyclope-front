import { useMemo } from 'react';

import { filesService } from '../services';
import { useThemeStore } from '../stores';
import { buildGeoJsonStyle, buildPmtilesStyle, buildXyzStyle } from '../utils';
import { filesQueries } from './files.queries';

export const useMapStyle = (carto) => {
    const extension = carto?.extension;
    const url = carto?.url;

    const { data: cartoPath } = filesQueries.useGetContent(url, {
        enabled: extension !== 'xyz',
    });
    const isDark = useThemeStore((state) => state.isDark);

    return useMemo(() => {
        if (!url) return undefined;

        switch (extension) {
            case 'pmtiles':
                return cartoPath ? buildPmtilesStyle(cartoPath, isDark) : undefined;

            case 'geojson':
            case 'geo.json':
            case 'json':
                return cartoPath ? buildGeoJsonStyle(cartoPath) : undefined;

            case 'xyz':
                return buildXyzStyle(filesService.getRedirectUrl(url));

            default:
                return undefined;
        }
    }, [cartoPath, extension, isDark, url]);
};

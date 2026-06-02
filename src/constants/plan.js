import { namedFlavor } from '@protomaps/basemaps';

export const GLYPHS_URL = '/fonts/{fontstack}/{range}.pbf';
export const SPRITE_URL = '/sprites/v4/light';
//'light', 'dark', 'white', 'grayscale', 'black'
export const MAP_THEME = namedFlavor('light');

export const MIN_ZOOM = 0;
export const MAX_ZOOM = 20;
export const INIT_ZOOM = 15;

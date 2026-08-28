export const ACCEPTED_VIDEO_EXTENSIONS = ['mp4', 'ts', 'flv', 'mkv'];
export const ACCEPTED_IMAGE_EXTENSIONS = ['jpg', 'png', 'tiff', 'bmp', 'jpeg'];
export const ACCEPTED_CARTO_EXTENSIONS = ['pmtiles', 'geojson', 'geo.json', 'json'];
export const ACCEPTED_XYZ_EXTENSIONS = ['png'];
export const SUPPORTED_CARTO_EXTENSIONS = [...ACCEPTED_CARTO_EXTENSIONS, 'xyz'];
export const ACCEPTED_MEDIA_EXTENSIONS = [
    ...ACCEPTED_VIDEO_EXTENSIONS,
    ...ACCEPTED_IMAGE_EXTENSIONS,
];

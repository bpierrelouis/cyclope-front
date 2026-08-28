import { lazyNamedExport } from '../../utils';

export const LazyTable = lazyNamedExport(() => import('./Table'), 'Table');

import { lazyNamedExport } from '../../utils';

export const LazyTable = lazyNamedExport(() => import('./table/Table'), 'Table');

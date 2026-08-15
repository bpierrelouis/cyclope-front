import { lazyNamedExport } from '../../utils';

export const LazyPlan = lazyNamedExport(() => import('./plan/Plan'), 'Plan');

export const LazyTable = lazyNamedExport(() => import('./table/Table'), 'Table');

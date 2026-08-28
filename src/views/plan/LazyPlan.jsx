import { lazyNamedExport } from '../../utils';

export const LazyPlan = lazyNamedExport(() => import('./Plan'), 'Plan');

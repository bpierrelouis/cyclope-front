import { lazyNamedExport } from '../../utils';

export const LazyPlan = lazyNamedExport(() => import('./plan/Plan'), 'Plan');

import { lazy } from 'react';

export const lazyNamedExport = (loadModule, exportName) => lazy(() =>
    loadModule().then((module) => ({ default: module[exportName] })));

import { registerHooks } from 'node:module';

const RESOLVABLE_ERRORS = new Set([
    'ERR_MODULE_NOT_FOUND',
    'ERR_UNSUPPORTED_DIR_IMPORT',
]);

const resolve = (specifier, context, nextResolve) => {
    try {
        return nextResolve(specifier, context);
    } catch (error) {
        if (!specifier.startsWith('.') || !RESOLVABLE_ERRORS.has(error.code)) throw error;

        for (const candidate of [`${specifier}.js`, `${specifier}/index.js`]) {
            try {
                return nextResolve(candidate, context);
            } catch (candidateError) {
                if (!RESOLVABLE_ERRORS.has(candidateError.code)) throw candidateError;
            }
        }

        throw error;
    }
};

registerHooks({ resolve });

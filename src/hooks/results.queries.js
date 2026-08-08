import { Result } from '../models';
import { playerService, resultsResourceName, resultsService } from '../services';
import { usePlayerStore } from '../stores';
import { createCrudQueries } from './crud.factory';

const resource = resultsResourceName;
const service = resultsService;

const replaceResult = (id, replacement) => {
    const results = usePlayerStore.getState().results.map(
        (result) => result.id === id ? replacement : result,
    );
    playerService.sync({ results });
};

const applyPatch = (result, data) => Result.mapper({
    ...result.meta,
    ...data,
    responseJson: data.responseJson
        ? { ...result.data, ...data.responseJson }
        : result.data,
});

const queries = createCrudQueries(resource, service, {
    update: {
        onError: (_error, { id }, context) => {
            if (context?.previous) replaceResult(id, context.previous);
        },
        onMutate: ({ id, data }) => {
            const previous = usePlayerStore.getState().results.find(
                (result) => result.id === id,
            );
            if (!previous) return;

            replaceResult(id, applyPatch(previous, data));
            return { previous };
        },
        onSuccess: (updated) => replaceResult(updated.id, updated),
    },
});

export const resultsQueries = queries;

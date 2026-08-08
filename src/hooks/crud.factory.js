import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const createCrudQueries = (resource, service, options = {}) => {
    const useGetAll = (urlSearchParams, queryOptions) => useQuery({
        queryFn: () => service.getAll(urlSearchParams),
        queryKey: urlSearchParams ? [resource, urlSearchParams.toString()] : [resource],
        ...queryOptions,
    });

    const useGetById = (id) => useQuery({
        enabled: !!Number(id),
        queryFn: () => service.getById(id),
        queryKey: [resource, id],
    });

    const useCreate = () => {
        const qc = useQueryClient();

        return useMutation({
            mutationFn: service.create,
            onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
        });
    };

    const useUpdate = () => {
        const qc = useQueryClient();

        return useMutation({
            mutationFn: ({ id, data }) =>
                service.update({ data, id }),
            onError: options.update?.onError,
            onMutate: options.update?.onMutate,
            onSuccess: (updated, variables, context) => {
                const { id } = variables;
                qc.invalidateQueries({ queryKey: [resource] });
                qc.invalidateQueries({ queryKey: [resource, id] });
                options.update?.onSuccess?.(updated, variables, context);
            },
        });
    };

    const useDelete = () => {
        const qc = useQueryClient();

        return useMutation({
            mutationFn: service.remove,
            onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
        });
    };

    return {
        useCreate, useDelete, useGetAll, useGetById, useUpdate,
    };
};

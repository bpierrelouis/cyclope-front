import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const createCrudQueries = (service, queryKeys, options = {}) => {
    const useGetAll = (urlSearchParams, queryOptions) => useQuery({
        queryFn: () => service.getAll(urlSearchParams),
        queryKey: queryKeys.list(urlSearchParams?.toString()),
        ...queryOptions,
    });

    const useGetById = (id) => useQuery({
        enabled: !!Number(id),
        queryFn: () => service.getById(id),
        queryKey: queryKeys.detail(id),
    });

    const useCreate = () => {
        const qc = useQueryClient();

        return useMutation({
            mutationFn: service.create,
            onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.lists }),
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
                qc.invalidateQueries({ queryKey: queryKeys.lists });
                qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
                options.update?.onSuccess?.(updated, variables, context);
            },
        });
    };

    const useDelete = () => {
        const qc = useQueryClient();

        return useMutation({
            mutationFn: service.remove,
            onSuccess: (_data, id) => {
                qc.removeQueries({ queryKey: queryKeys.detail(id) });
                qc.invalidateQueries({ queryKey: queryKeys.lists });
            },
        });
    };

    return {
        useCreate, useDelete, useGetAll, useGetById, useUpdate,
    };
};

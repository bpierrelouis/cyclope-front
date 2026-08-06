import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const createCrudQueries = (resource, service, options = {}) => {
    const useGetAll = (urlSearchParams, options) => useQuery({
        queryKey: urlSearchParams ? [resource, urlSearchParams.toString()] : [resource],
        queryFn: () => service.getAll(urlSearchParams),
        ...options,
    });

    const useGetById = (id) => useQuery({
        queryKey: [resource, id],
        queryFn: () => service.getById(id),
        enabled: !!Number(id),
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
                service.update({ id, data }),
            onMutate: options.update?.onMutate,
            onSuccess: (updated, variables, context) => {
                const { id } = variables;
                qc.invalidateQueries({ queryKey: [resource] });
                qc.invalidateQueries({ queryKey: [resource, id] });
                options.update?.onSuccess?.(updated, variables, context);
            },
            onError: options.update?.onError,
        });
    };

    const useDelete = () => {
        const qc = useQueryClient();

        return useMutation({
            mutationFn: service.remove,
            onSuccess: () => qc.invalidateQueries({ queryKey: [resource] }),
        });
    };

    return { useGetAll, useGetById, useCreate, useUpdate, useDelete };
};

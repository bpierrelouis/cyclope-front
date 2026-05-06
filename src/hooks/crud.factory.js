import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCrudService } from '../services/crud.factory';

export const createCrudQuery = (resource) => {
    const service = createCrudService(resource);

    const useGetAll = () => useQuery({
        queryKey: [resource],
        queryFn: service.getAll,
    });

    const useGetById = (id) => useQuery({
        queryKey: [resource, id],
        queryFn: () => service.getById(id),
        enabled: !!id,
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
            onSuccess: (_, { id }) => {
                qc.invalidateQueries({ queryKey: [resource] });
                qc.invalidateQueries({ queryKey: [resource, id] });
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

    return { useGetAll, useGetById, useCreate, useUpdate, useDelete };
};

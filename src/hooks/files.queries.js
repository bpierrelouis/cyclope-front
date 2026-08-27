import {
    useIsMutating, useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query';

import {
    ACCEPTED_CARTO_EXTENSIONS,
    ACCEPTED_MEDIA_EXTENSIONS,
    filesMutationKeys,
    filesQueryKeys,
} from '../constants';
import { filesService } from '../services';
import { joinPath } from '../utils';
import { createCrudQueries } from './crud.factory';

const service = filesService;

const queries = createCrudQueries(service, filesQueryKeys);

const useGetContent = (url, options = {}) => useQuery({
    ...options,
    enabled: !!url && options.enabled !== false,
    queryFn: () => service.getContent(url),
    queryKey: filesQueryKeys.content(url),
});

const useGetTree = (folder) => useQuery({
    queryFn: () => service.getTree(folder),
    queryKey: [...filesQueryKeys.tree, folder],
});

const useGetTreeCarto = () => useGetTree('carto');
const useGetTreeMedia = () => useGetTree('media');

const useUploadFiles = ({ acceptedExtensions, allowXyzFolder = false, rootFolder }) => {
    const queryClient = useQueryClient();
    const treeQueryKey = [...filesQueryKeys.tree, rootFolder];

    return useMutation({
        mutationFn: ({ files, folder, onProgress }) => service.saveFiles({
            acceptedExtensions,
            allowXyzFolder,
            files,
            folder: joinPath(rootFolder, folder),
            onProgress: (completed, total, result) => {
                queryClient.invalidateQueries({ queryKey: treeQueryKey });
                onProgress?.(completed, total, result);
            },
        }),
        mutationKey: filesMutationKeys.upload(rootFolder),
        onSettled: () => queryClient.invalidateQueries({
            queryKey: treeQueryKey,
        }),
    });
};

const useUploadFilesCarto = () => useUploadFiles({
    acceptedExtensions: ACCEPTED_CARTO_EXTENSIONS,
    allowXyzFolder: true,
    rootFolder: 'carto',
});
const useUploadFilesMedias = () => useUploadFiles({
    acceptedExtensions: ACCEPTED_MEDIA_EXTENSIONS,
    rootFolder: 'media',
});
const useIsUploadingMedias = () => useIsMutating({
    mutationKey: filesMutationKeys.upload('media'),
}) > 0;

const useDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: service.remove,
        onSettled: () => queryClient.invalidateQueries({ queryKey: filesQueryKeys.all }),
    });
};

const useDeleteMany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: service.removeMany,
        onSettled: () => queryClient.invalidateQueries({ queryKey: filesQueryKeys.all }),
    });
};

export const filesQueries = {
    ...queries,
    useDelete,
    useDeleteMany,
    useGetContent,
    useGetTreeCarto,
    useGetTreeMedia,
    useIsUploadingMedias,
    useUploadFilesCarto,
    useUploadFilesMedias,
};

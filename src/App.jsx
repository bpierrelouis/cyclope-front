import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router';
import { BROWSER_ROUTER } from './router';
import { eventsManager } from './services';

export default function App() {
    const queryClient = useMemo(() => {
        return new QueryClient();
    }, []);

    useEffect(() => {
        eventsManager.connect(queryClient);
        return () => eventsManager.disconnect();
    }, [queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={BROWSER_ROUTER} />
        </QueryClientProvider>
    );
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router';

import { SelectionProvider } from './contexts';
import { AppRouter } from './router';
import { eventsManager, resultsSyncService } from './services';

export default function App() {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        const disconnectEvents = eventsManager.connect(queryClient);
        const disconnectResultsSync = resultsSyncService.connect(queryClient);

        return () => {
            disconnectEvents();
            disconnectResultsSync();
        };
    }, [queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <SelectionProvider>
                    <AppRouter />
                </SelectionProvider>
            </BrowserRouter>
            <Toaster
                position='top-right'
                toastOptions={{
                    duration: 5000,
                    removeDelay: 0,
                }}
            />
        </QueryClientProvider>
    );
}

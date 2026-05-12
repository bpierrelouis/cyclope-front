import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { BROWSER_ROUTER } from './router';

export default function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={BROWSER_ROUTER} />
        </QueryClientProvider>
    );
}

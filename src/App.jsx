import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { BROWSER_ROUTER } from './router';
import './style.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={BROWSER_ROUTER} />
    </StrictMode>,
);

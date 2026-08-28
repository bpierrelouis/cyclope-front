import { createContext, useContext } from 'react';

export const SelectionContext = createContext(null);

export const useSelectionContext = () => {
    const context = useContext(SelectionContext);

    if (!context) {
        throw new Error('useSelectionContext doit être utilisé dans SelectionProvider');
    }
    return context;
};

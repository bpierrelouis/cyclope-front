import { createContext, useContext } from 'react';

export const SelectionContext = createContext(null);

export const useSelectionContext = () => useContext(SelectionContext);

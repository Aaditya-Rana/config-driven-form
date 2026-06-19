import React, { createContext, useContext } from 'react';
import { FormClassNames } from '../types/schema';

const ClassNamesContext = createContext<FormClassNames>({});

export const ClassNamesProvider: React.FC<{
  value?: FormClassNames;
  children: React.ReactNode;
}> = ({ value = {}, children }) => {
  return <ClassNamesContext.Provider value={value}>{children}</ClassNamesContext.Provider>;
};

export const useClassNames = () => useContext(ClassNamesContext);

// Utility to merge class strings easily without an external library
export const cx = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ').trim();
};

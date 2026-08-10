import React, { createContext, useContext, useMemo, useState } from 'react';

type AddRexFabChromeValue = {
  fabVisible: boolean;
  setMapPinSheetOpen: (open: boolean) => void;
};

const AddRexFabChromeContext = createContext<AddRexFabChromeValue | null>(null);

export function AddRexFabChromeProvider({ children }: { children: React.ReactNode }) {
  const [mapPinSheetOpen, setMapPinSheetOpen] = useState(false);

  const value = useMemo<AddRexFabChromeValue>(
    () => ({
      fabVisible: !mapPinSheetOpen,
      setMapPinSheetOpen,
    }),
    [mapPinSheetOpen],
  );

  return (
    <AddRexFabChromeContext.Provider value={value}>{children}</AddRexFabChromeContext.Provider>
  );
}

export function useAddRexFabVisible() {
  return useContext(AddRexFabChromeContext)?.fabVisible ?? true;
}

export function useSetMapPinSheetOpen() {
  return useContext(AddRexFabChromeContext)?.setMapPinSheetOpen ?? (() => {});
}

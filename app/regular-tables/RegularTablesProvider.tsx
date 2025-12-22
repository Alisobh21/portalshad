"use client";

import React, { FC, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "./provider/store";

interface RegularTablesProviderProps {
  children: ReactNode;
}

const RegularTablesProvider: FC<RegularTablesProviderProps> = ({
  children,
}) => {
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
};

export default RegularTablesProvider;

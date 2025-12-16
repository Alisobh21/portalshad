"use client";

import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./table-providers/store";

export default function ApiTablesProvider({ children }: any) {
    const { outScopeTableRefresher } = useSelector((state: any) => state?.app);

    return (
        <div key={outScopeTableRefresher}>
            <Provider store={store}>{children}</Provider>
        </div>
    );
}

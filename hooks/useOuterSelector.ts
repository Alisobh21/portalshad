import { ReactReduxContext } from "react-redux";
import { useContext, useSyncExternalStore } from "react";

export function useOuterSelector(selector: any) {
    const { store } = useContext(ReactReduxContext) as any;

    return useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState()), // client snapshot
        () => selector(store.getState()) // server snapshot (fixes the warning)
    );
}

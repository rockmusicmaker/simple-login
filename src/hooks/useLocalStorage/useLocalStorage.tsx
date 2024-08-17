import { useCallback, useMemo } from "react";

export type LocalStorageUpdater<T extends string> = (
  updater: T | undefined | ((currentValue: T | undefined) => T | undefined)
) => void;

export const useLocalStorage = <T extends string = string>(
  key: string
): [T | undefined, LocalStorageUpdater<T>] => {
  const value = useMemo<T | undefined>(() => {
    try {
      return (window.localStorage.getItem(key) ?? undefined) as T | undefined;
    } catch (error) {
      return undefined;
    }
  }, [key]);

  const setValue = useCallback<LocalStorageUpdater<T>>(
    (updater) => {
      const updatedValue =
        typeof updater === "function" ? updater(value) : updater;

      if (updatedValue === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, updatedValue);
      }
    },
    [key, value]
  );

  return useMemo(() => [value, setValue], [value, setValue]);
};

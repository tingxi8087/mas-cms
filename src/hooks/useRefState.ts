import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

export type ReadonlyStateRef<T> = {
  readonly current: T;
};

export const useRefState = <T>(
  initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>, ReadonlyStateRef<T>] => {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);

  const setRefState: Dispatch<SetStateAction<T>> = useCallback((value) => {
    setState((prevState) => {
      const nextState =
        typeof value === "function"
          ? (value as (prevState: T) => T)(prevState)
          : value;

      stateRef.current = nextState;
      return nextState;
    });
  }, []);

  return [state, setRefState, stateRef];
};

import { useEffect, useRef } from "react";

export function useInterval<C extends CallableFunction>(
  callbackFN: C,
  delay: number | null,
  ): void {

    const savedCallback = useRef<C>();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callbackFN;
    }, [callbackFN]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        if (savedCallback.current) savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
}
import { RefObject, useCallback, useLayoutEffect, useMemo, useState } from "react";

import { useDomChange } from "./useDomChange";

type ElementRect = Pick<DOMRect, "bottom" | "height" | "left" | "right" | "top" | "width" | "x" | "y">;

export interface UseElementBottomDistanceOptions {
  enabled?: boolean;
  extraRefs?: RefObject<Element | null>[];
  minDistance?: number;
}

export const useElementBottomDistance = (
  targetRef: RefObject<Element | null>,
  options: UseElementBottomDistanceOptions = {},
) => {
  const { enabled = true, extraRefs = [], minDistance = 0 } = options;
  const [distance, setDistance] = useState(minDistance);
  const [rect, setRect] = useState<ElementRect>();
  const targetRefs = useMemo(() => [targetRef, ...extraRefs], [extraRefs, targetRef]);
  const { version, refresh: refreshDomChange } = useDomChange(targetRefs, {
    enabled,
  });

  const measure = useCallback(() => {
    const element = targetRef.current;
    if (!enabled || !element) {
      setDistance(minDistance);
      setRect(undefined);
      return;
    }

    const nextRect = element.getBoundingClientRect();
    const nextDistance = Math.max(minDistance, window.innerHeight - nextRect.bottom);

    setDistance(nextDistance);
    setRect({
      bottom: nextRect.bottom,
      height: nextRect.height,
      left: nextRect.left,
      right: nextRect.right,
      top: nextRect.top,
      width: nextRect.width,
      x: nextRect.x,
      y: nextRect.y,
    });
  }, [enabled, minDistance, targetRef]);

  const refresh = useCallback(() => {
    measure();
    refreshDomChange();
  }, [measure, refreshDomChange]);

  useLayoutEffect(() => {
    measure();
  }, [measure, version]);

  return {
    distance,
    rect,
    refresh,
    version,
  };
};

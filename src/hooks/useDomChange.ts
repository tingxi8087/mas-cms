import { RefObject, useCallback, useEffect, useRef, useState } from "react";

type DomChangeRef = RefObject<Element | null>;

export interface UseDomChangeOptions {
  enabled?: boolean;
  observeMutation?: boolean;
  onChange?: () => void;
}

const getRefElement = (ref: DomChangeRef) => ref.current;

/**
 * 监听页面尺寸和 DOM 变化的通用 hook。
 * 适合给上层测量类 hook 使用，不绑定具体业务。
 */
export const useDomChange = (
  targetRefs: DomChangeRef[] = [],
  options: UseDomChangeOptions = {},
) => {
  const { enabled = true, observeMutation = true, onChange } = options;
  const [version, setVersion] = useState(0);
  const frameRef = useRef<number>();
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const refresh = useCallback(() => {
    if (!enabled) return;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(() => {
      setVersion((prev) => prev + 1);
      onChangeRef.current?.();
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;

    const observedElements = [
      document.documentElement,
      document.body,
      ...targetRefs.map(getRefElement).filter(Boolean),
    ] as Element[];

    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);
    window.addEventListener("scroll", refresh, true);

    const resizeObserver = new ResizeObserver(refresh);
    observedElements.forEach((element) => resizeObserver.observe(element));

    const mutationObserver = observeMutation
      ? new MutationObserver(refresh)
      : undefined;

    mutationObserver?.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    refresh();

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      window.removeEventListener("scroll", refresh, true);
      resizeObserver.disconnect();
      mutationObserver?.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [enabled, observeMutation, refresh, targetRefs]);

  return {
    version,
    refresh,
  };
};

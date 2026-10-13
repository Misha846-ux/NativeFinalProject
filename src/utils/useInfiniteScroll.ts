import { useEffect, useRef, useCallback, type RefObject } from "react";

type UseInfiniteScrollOptions = {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    rootRef?: RefObject<HTMLElement | null>;
    rootMargin?: string;
};

export function useInfiniteScroll({
    onLoadMore,
    hasMore,
    isLoading,
    rootRef,
    rootMargin = "200px",
}: UseInfiniteScrollOptions) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const callbackRef = useRef(onLoadMore);

    useEffect(() => {
        callbackRef.current = onLoadMore;
    }, [onLoadMore]);

    const trigger = useCallback(() => {
        if (!isLoading && hasMore) {
            callbackRef.current();
        }
    }, [isLoading, hasMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    trigger();
                }
            },
            {
                root: rootRef?.current ?? null,
                rootMargin,
                threshold: 0,
            },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [trigger, hasMore, rootRef, rootMargin]);

    return sentinelRef;
}
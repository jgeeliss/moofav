/**
 * Creates and attaches an IntersectionObserver to implement infinite scrolling.
 * @param {{
 *   sentinel: Element,
 *   state: { isLoading: boolean, hasMorePagesToLoad: boolean },
 *   onLoadMore: () => Promise<boolean> | boolean
 * }} params - Sentinel element, state object and load callback.
 * @returns {IntersectionObserver} Active observer instance.
 */
export function setupInfiniteScroll({ sentinel, state, onLoadMore }) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (state.isLoading || !state.hasMorePagesToLoad) {
          return;
        }

        if (entry.isIntersecting) {
          state.isLoading = true;
          Promise.resolve(onLoadMore())
            .then((morePagesToLoad) => {
              state.hasMorePagesToLoad = morePagesToLoad;
            })
            .finally(() => {
              state.isLoading = false;
            });
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '500px',
    }
  );

  observer.observe(sentinel);
  return observer;
}

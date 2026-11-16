import { useEffect } from 'react';

const SUFFIX = 'Clientes App';

/** Keeps `document.title` in sync with the active page. */
export function usePageTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX;

    return () => {
      document.title = previous;
    };
  }, [title]);
}

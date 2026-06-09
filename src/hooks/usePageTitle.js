import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · StudyHub` : 'StudyHub · UNIR';
    return () => {
      document.title = 'StudyHub · UNIR';
    };
  }, [title]);
}

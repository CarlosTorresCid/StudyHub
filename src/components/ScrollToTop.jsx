import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const main = document.querySelector('.app-main');

    if (main) {
      main.scrollTo({ top: 0, behavior: 'auto' });
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, search, hash]);

  return null;
}
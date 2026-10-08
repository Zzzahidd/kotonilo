/**
 * Lightweight SPA navigation helper for smooth, instant transitions without page reload
 */
export const navigate = (to: string) => {
  if (!to) return;
  const targetUrl = to.startsWith('/') ? to : `/${to}`;
  const currentUrl = window.location.pathname + window.location.search;

  if (targetUrl !== currentUrl) {
    window.history.pushState({}, '', targetUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  // Smoothly scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

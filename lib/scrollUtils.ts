/**
 * Smoothly scrolls to a specified element ID or section on the page.
 * Interoperates with Lenis smooth-scroller and standard browser scrolling.
 * Safe for HashRouter — does not mutate window.location.hash to prevent unintended route changes.
 */
export const smoothScrollToSection = (targetId: string, offset: number = -80) => {
  if (typeof window === 'undefined') return;

  const cleanId = targetId.replace(/^[#/]+/, '');
  const lenis = (window as any).__lenis || (window as any).lenis;

  if (cleanId === 'overview' || cleanId === 'top' || cleanId === '') {
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  const el = document.getElementById(cleanId);
  if (el) {
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(el, { offset, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

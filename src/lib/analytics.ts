export const trackEvent = (eventName: string, props?: Record<string, string>) => {
  try {
    if (typeof window !== 'undefined' && (window as any).plausible) {
      if (props) {
        (window as any).plausible(eventName, { props });
      } else {
        (window as any).plausible(eventName);
      }
    }
  } catch (err) {}
};

import { useEffect, useRef } from 'react';

export function NativeBanner() {
  const adInjected = useRef(false);

  useEffect(() => {
    if (adInjected.current) return;
    adInjected.current = true;

    const container = document.getElementById('container-4aabe16ca26511e99e49b87f1525d4ef');
    if (container && !container.querySelector('script')) {
      const script = document.createElement('script');
      script.src = "https://pl29653455.effectivecpmnetwork.com/4aabe16ca26511e99e49b87f1525d4ef/invoke.js";
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full mt-6 mb-2 flex justify-center overflow-hidden z-10 relative relative min-h-[50px]">
      <div id="container-4aabe16ca26511e99e49b87f1525d4ef"></div>
    </div>
  );
}

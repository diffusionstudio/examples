const isSupported = !navigator.userAgent.toLowerCase().includes('firefox');


if (!isSupported) {
  const el = document.querySelector('[id="browser-not-supported"]') as HTMLParagraphElement;
  el.style.display = 'block';
}

export const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/**
 * Insert a link to all styles into the body
 */
export function loadAllStylesOnClient(params: { fileName: string }): void {
  if (typeof window === 'undefined') {
    return;
  }

  const { fileName } = params;

  const linkEl = document.createElement('link');
  const href = fileName.replace('//', '/');

  linkEl.setAttribute('rel', 'stylesheet');
  linkEl.setAttribute('href', href);

  'requestIdleCallback' in window
    ? window.requestIdleCallback(() => {
        document.body.appendChild(linkEl);
      })
    : window.setTimeout(() => {
        document.body.appendChild(linkEl);
      }, 0);
}

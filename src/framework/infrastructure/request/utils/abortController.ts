// @TODO update name
export function createCombinedAbortController(networkTimeout: number, userSignal?: AbortSignal | null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    if (!controller.signal.aborted) {
      controller.abort();
    }
  }, networkTimeout);
  const mutableSignals = [controller.signal];

  if (userSignal) {
    mutableSignals.push(userSignal);
  }

  const signal = abortAny(mutableSignals);

  return {
    signal,
    cancelTimeoutAbort: () => clearTimeout(timeoutId),
  };
}

export function getStatusFromAbortReason(reason: AbortSignal['reason'], fallback: number): number {
  return 'status' in reason && typeof reason.status === 'number' ? reason.status : fallback;
}

export function getStatusTextFromAbortReason(reason: AbortSignal['reason'], fallback: string): string {
  if (reason instanceof DOMException) {
    return 'Network connect timeout error';
  }

  if ('statusText' in reason && typeof reason.statusText === 'string') {
    return reason.statusText || fallback;
  }

  return fallback;
}

function abortAny(signals: AbortSignal[]) {
  const controller = new AbortController();

  signals.forEach((signal) => {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  });

  return controller.signal;
}

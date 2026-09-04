export function isCloudDebugEnabled(): boolean {
  return (
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    (typeof globalThis !== "undefined" &&
      (globalThis as { __PKFACTORY_CLOUD_DEBUG__?: boolean }).__PKFACTORY_CLOUD_DEBUG__ === true)
  );
}

export function cloudDebugLog(event: string, data?: Record<string, unknown>): void {
  if (!isCloudDebugEnabled()) {
    return;
  }
  if (data) {
    console.log(`[pkfactory-cloud] ${event}`, data);
  } else {
    console.log(`[pkfactory-cloud] ${event}`);
  }
}

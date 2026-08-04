const sites: Record<string, { service: string; environment: string }> = {
  'mdolnicek.eu': { service: 'mdolnicek-web', environment: 'production' }
};

const site = sites[location.hostname];

if (site) {
  let lastError = '';
  let lastErrorAt = 0;

  const id = (bytes: number) => {
    const value = new Uint8Array(bytes);
    crypto.getRandomValues(value);
    return Array.from(value, (byte) => byte.toString(16).padStart(2, '0')).join('');
  };

  const attribute = (key: string, value: string) => ({ key, value: { stringValue: value } });

  const report = (reason: unknown, source: string) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    const message = error.message.slice(0, 1000);
    const dedupeKey = `${source}:${error.name}:${message}`;
    const now = Date.now();
    if (dedupeKey === lastError && now - lastErrorAt < 1000) return;
    lastError = dedupeKey;
    lastErrorAt = now;

    const timestamp = (BigInt(now) * 1_000_000n).toString();
    const exceptionAttributes = [
      attribute('exception.type', error.name.slice(0, 120)),
      attribute('exception.message', message)
    ];
    if (error.stack) exceptionAttributes.push(attribute('exception.stacktrace', error.stack.slice(0, 5000)));

    void fetch('https://browser-otel.idoweb.eu/v1/traces', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'omit',
      keepalive: true,
      body: JSON.stringify({
        resourceSpans: [{
          resource: { attributes: [
            attribute('service.name', site.service),
            attribute('service.namespace', 'web'),
            attribute('deployment.environment.name', site.environment)
          ] },
          scopeSpans: [{
            scope: { name: 'frontend-errors' },
            spans: [{
              traceId: id(16),
              spanId: id(8),
              name: 'frontend.error',
              startTimeUnixNano: timestamp,
              endTimeUnixNano: timestamp,
              attributes: [
                attribute('error.source', source),
                attribute('url.path', location.pathname)
              ],
              events: [{ name: 'exception', timeUnixNano: timestamp, attributes: exceptionAttributes }],
              status: { code: 2, message }
            }]
          }]
        }]
      })
    }).catch(() => {});
  };

  addEventListener('error', (event: Event) => {
    if (event instanceof ErrorEvent) {
      report(event.error ?? event.message, 'window.error');
      return;
    }
    const target = event.target as (EventTarget & { src?: string; href?: string }) | null;
    const rawUrl = target?.src ?? target?.href;
    const path = rawUrl ? new URL(rawUrl, location.href).pathname : 'unknown resource';
    report(new Error(`Failed to load ${path}`), 'resource.error');
  }, true);

  addEventListener('unhandledrejection', (event) => report(event.reason, 'unhandledrejection'));

  const originalConsoleError = console.error.bind(console);
  console.error = (...values: unknown[]) => {
    report(values.find((value) => value instanceof Error) ?? values.map(String).join(' '), 'console.error');
    originalConsoleError(...values);
  };
}

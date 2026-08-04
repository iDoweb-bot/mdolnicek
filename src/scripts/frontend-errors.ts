import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

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

  const attribute = (key: string, value: string | number) => ({
    key,
    value: typeof value === 'number' ? { doubleValue: value } : { stringValue: value }
  });
  const nanoseconds = (milliseconds: number) => BigInt(Math.round(milliseconds * 1_000_000)).toString();

  const sendSpan = (scope: string, span: Record<string, unknown>) => {
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
          scopeSpans: [{ scope: { name: scope }, spans: [span] }]
        }]
      })
    }).catch(() => {});
  };

  const report = (reason: unknown, source: string) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    const message = error.message.slice(0, 1000);
    const dedupeKey = `${source}:${error.name}:${message}`;
    const now = Date.now();
    if (dedupeKey === lastError && now - lastErrorAt < 1000) return;
    lastError = dedupeKey;
    lastErrorAt = now;

    const timestamp = nanoseconds(now);
    const exceptionAttributes = [
      attribute('exception.type', error.name.slice(0, 120)),
      attribute('exception.message', message)
    ];
    if (error.stack) exceptionAttributes.push(attribute('exception.stacktrace', error.stack.slice(0, 5000)));

    sendSpan('frontend-errors', {
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
    });
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

  // ponytail: query-gated one-release smoke hook; remove after SigNoz verification.
  if (new URLSearchParams(location.search).has('signoz-error-smoke')) {
    setTimeout(() => { throw new Error('Intentional SigNoz frontend smoke test'); });
  }

  const reportVital = (metric: Metric) => {
    const timestamp = nanoseconds(Date.now());
    sendSpan('frontend-performance', {
      traceId: id(16),
      spanId: id(8),
      name: `frontend.web_vital.${metric.name.toLowerCase()}`,
      startTimeUnixNano: timestamp,
      endTimeUnixNano: timestamp,
      attributes: [
        attribute('web_vital.name', metric.name),
        attribute('web_vital.value', metric.value),
        attribute('web_vital.delta', metric.delta),
        attribute('web_vital.rating', metric.rating),
        attribute('web_vital.unit', metric.name === 'CLS' ? '1' : 'ms'),
        attribute('url.path', location.pathname)
      ]
    });
  };

  onCLS(reportVital);
  onFCP(reportVital);
  onINP(reportVital);
  onLCP(reportVital);
  onTTFB(reportVital);

  const reportNavigation = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (!navigation?.duration) return;
    const start = performance.timeOrigin + navigation.startTime;
    sendSpan('frontend-performance', {
      traceId: id(16),
      spanId: id(8),
      name: 'frontend.performance.navigation',
      startTimeUnixNano: nanoseconds(start),
      endTimeUnixNano: nanoseconds(start + navigation.duration),
      attributes: [
        attribute('performance.navigation.type', navigation.type),
        attribute('performance.duration_ms', navigation.duration),
        attribute('performance.dns_ms', navigation.domainLookupEnd - navigation.domainLookupStart),
        attribute('performance.connect_ms', navigation.connectEnd - navigation.connectStart),
        attribute('performance.ttfb_ms', navigation.responseStart - navigation.requestStart),
        attribute('performance.download_ms', navigation.responseEnd - navigation.responseStart),
        attribute('performance.dom_interactive_ms', navigation.domInteractive),
        attribute('performance.dom_content_loaded_ms', navigation.domContentLoadedEventEnd),
        attribute('performance.load_event_ms', navigation.loadEventEnd),
        attribute('url.path', location.pathname)
      ]
    });
  };

  if (document.readyState === 'complete') setTimeout(reportNavigation);
  else addEventListener('load', () => setTimeout(reportNavigation), { once: true });
}

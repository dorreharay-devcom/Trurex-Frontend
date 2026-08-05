import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsEvent, setAnalyticsSink, track } from '~/shared/lib/analytics/track';

describe('analytics track', () => {
  afterEach(() => {
    setAnalyticsSink(null);
  });

  it('forwards events to sink and swallows sink errors', () => {
    const sink = vi.fn();
    setAnalyticsSink(sink);
    track(AnalyticsEvent.AppOpened, { a: 1 });
    expect(sink).toHaveBeenCalledWith(AnalyticsEvent.AppOpened, { a: 1 });

    setAnalyticsSink(() => {
      throw new Error('sink failed');
    });
    expect(() => track('x')).not.toThrow();
  });
});

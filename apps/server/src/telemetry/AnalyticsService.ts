import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

/**
 * Product analytics are intentionally disabled in PK Factory. Callers keep a
 * service boundary so workflow and provider code does not need privacy-policy
 * branches, but every operation is a no-op and performs no network or disk IO.
 */
export class AnalyticsService extends Context.Service<
  AnalyticsService,
  {
    readonly record: (
      event: string,
      properties?: Readonly<Record<string, unknown>>,
    ) => Effect.Effect<void>;
    readonly flush: Effect.Effect<void>;
  }
>()("pkfactory/telemetry/AnalyticsService") {
  static readonly layerTest = Layer.succeed(
    AnalyticsService,
    AnalyticsService.of({
      record: () => Effect.void,
      flush: Effect.void,
    }),
  );
}

export const layer = AnalyticsService.layerTest;
export const layerTest = AnalyticsService.layerTest;

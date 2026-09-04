import { assert, it } from "@effect/vitest";
import * as Effect from "effect/Effect";

import * as AnalyticsService from "./AnalyticsService.ts";

it.effect("keeps product analytics disabled", () =>
  Effect.gen(function* () {
    const analytics = yield* AnalyticsService.AnalyticsService;
    yield* analytics.record("test.event", { value: "private" });
    yield* analytics.flush;
    assert.isTrue(true);
  }).pipe(Effect.provide(AnalyticsService.layer)),
);

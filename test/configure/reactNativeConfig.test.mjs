// @ts-check
import { equal } from "node:assert/strict";
import { describe, it } from "node:test";
import { reactNativeConfig as reactNativeConfigActual } from "../../scripts/configure.mjs";
import { mockParams } from "./mockParams.mjs";

describe("reactNativeConfig()", () => {
  /** @type {(params: import("../../scripts/types.js").ConfigureParams) => string} */
  const reactNativeConfig = (params) => {
    const config = reactNativeConfigActual(params);
    if (typeof config !== "string") {
      throw new Error("Expected a string");
    }
    return config;
  };

  it("returns generic config for all platforms", () => {
    const genericConfig = reactNativeConfig(mockParams());
    equal(genericConfig.includes("android: {"), true);
    equal(genericConfig.includes("ios: {"), true);
    equal(genericConfig.includes("windows: {"), true);

    const withSinglePlatform = mockParams({ platforms: ["ios"] });
    equal(reactNativeConfig(withSinglePlatform), genericConfig);
  });
});

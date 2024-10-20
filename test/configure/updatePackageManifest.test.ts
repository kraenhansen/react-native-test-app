import { deepEqual } from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { URL } from "node:url";
import { updatePackageManifest as updatePackageManifestActual } from "../../scripts/configure.mjs";
import { readJSONFile } from "../../scripts/helpers.js";
import type { Manifest } from "../../scripts/types.js";
import { fs, setMockFiles } from "../fs.mock.js";

function getExampleManifest() {
  const p = new URL("../../example/package.json", import.meta.url);
  const manifest = readJSONFile(p);
  return manifest as Manifest;
}

describe("updatePackageManifest()", () => {
  const updatePackageManifest: typeof updatePackageManifestActual = (p, cfg) =>
    updatePackageManifestActual(p, cfg, fs);

  const exampleManifest = getExampleManifest();
  const devDependencies = {
    "@rnx-kit/metro-config":
      exampleManifest["devDependencies"]?.["@rnx-kit/metro-config"],
    "react-native-test-app": "^0.0.1-dev",
  };

  afterEach(() => setMockFiles());

  it("adds `scripts` field if missing", () => {
    setMockFiles({ "package.json": `{ "key": "value" }` });

    const config = {
      scripts: {
        test: "jest",
      },
      dependencies: {},
      files: {},
      oldFiles: [],
    };

    deepEqual(updatePackageManifest("package.json", config), {
      key: "value",
      scripts: {
        test: "jest",
      },
      dependencies: {},
      devDependencies,
    });
  });

  it("adds to existing `scripts` field", () => {
    setMockFiles({
      "package.json": JSON.stringify({
        key: "value",
        scripts: {
          test: "jest",
        },
      }),
    });

    const config = {
      scripts: {
        run: "run",
      },
      dependencies: {},
      files: {},
      oldFiles: [],
    };

    deepEqual(updatePackageManifest("package.json", config), {
      key: "value",
      scripts: {
        run: "run",
        test: "jest",
      },
      dependencies: {},
      devDependencies,
    });
  });
});

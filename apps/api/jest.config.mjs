/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm", // preset ESM de ts-jest
  testEnvironment: "node",
  roots: ["<rootDir>/test"],             // tu carpeta de tests
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
  extensionsToTreatAsEsm: [".ts"],       // los .ts se tratan como ESM
};

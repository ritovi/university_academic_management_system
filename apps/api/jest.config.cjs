// jest.config.cjs

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 1. Indicar que es un preset de ts-jest para ES Modules
  preset: "ts-jest/presets/default-esm",

  // 2. Indicar que el entorno de prueba es node
  testEnvironment: "node",

  // 3. Configuración de la transformación (necesaria para ESM)
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true, // ¡Importante! Le dice a ts-jest que genere ESM
      },
    ],
  },

  // 4. AÑADE ESTO:
  // Ayuda a Jest a resolver las importaciones .js para que apunten a los archivos .ts
  moduleNameMapper: {
    "^(\\.\\.?/.*)\\.js$": "$1",
  },
};

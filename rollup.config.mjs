import typescript from "@rollup/plugin-typescript";

const external = [
  "@nestjs/common",
  "@nestjs/core",
  "rxjs",
  "rxjs/operators",
  "react",
  "react/jsx-runtime",
];

export default [
  // ESM build
  {
    input: {
      index: "src/index.ts",
      "nestjs/index": "src/nestjs/index.ts",
      "nextjs/index": "src/nextjs/index.ts",
      "i18n/index": "src/i18n/index.ts",
      "i18n/react/index": "src/i18n/react/index.ts",
    },
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    external,
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        outDir: "dist/esm",
      }),
    ],
  },
  // CommonJS build
  {
    input: {
      index: "src/index.ts",
      "nestjs/index": "src/nestjs/index.ts",
      "nextjs/index": "src/nextjs/index.ts",
      "i18n/index": "src/i18n/index.ts",
      "i18n/react/index": "src/i18n/react/index.ts",
    },
    output: {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      exports: "named",
    },
    external,
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        outDir: "dist/cjs",
      }),
    ],
  },
];

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@hooks": "./src/hooks",
            "@context": "./src/context",
            "@components": "./src/components",
            "@utils": "./src/utils",
            "@store": "./src/store",
            "@data-types": "./src/types",
            "@api-calls": "./src/api-calls",
            "@animations": "./src/animations",
            "@helpers": "./src/helpers",
            "@assets": "./assets",
            "@screens": "./src/screens",
          },
        },
      ],
    ],
  };
};

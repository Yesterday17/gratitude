/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
  base: "",
  server: {
    proxy: {
      "/list": "http://localhost:3010/visitor",
      "/file": "http://localhost:3010/visitor",
    },
  },
};

export default config;

import { defineConfig } from "@rsbuild/core";
import { pluginVue } from "@rsbuild/plugin-vue";

export default defineConfig({
  output: {
    legalComments: "none", // 去除版权信息
    assetPrefix: "auto", // 相对路径前缀
    sourceMap: {
      // 生产环境下关闭 sourceMap
      js: false,
      css: false,
    },
  },
  plugins: [pluginVue()],
});

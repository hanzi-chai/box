import { defineConfig } from "@rsbuild/core"
import { pluginVue } from "@rsbuild/plugin-vue"
import UnoCSS from "@unocss/postcss"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import VueComponents from "unplugin-vue-components/rspack"

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
  html: {
    template: "src/index.html",
  },
  plugins: [pluginVue()],
  tools: {
    rspack: {
      plugins: [
        VueComponents({
          extensions: ["vue", "md"],
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
          dts: "src/components.d.ts",
          resolvers: [ElementPlusResolver()],
        }),
      ],
      experiments: {
        parallelCodeSplitting: true,
      },
    },
    postcss(cfg, { addPlugins }) {
      addPlugins(UnoCSS())
    },
  },
})

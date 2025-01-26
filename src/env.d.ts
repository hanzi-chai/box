/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  // import.meta.env.BUILD_TIME
  readonly BUILD_TIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
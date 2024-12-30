export * from "./all-platforms"
export * from "./detect-plat"
export * from "./duoduo"
export * from "./raw-file"
export * from "./rime"
export * from "./sogo/autoplat"
export * from "./yong"

export class FormatError extends Error {
  constructor() {
    super()
    this.name = "FormatError"
  }
}

export type PlatTypes = "auto" | "rime" | "duoduo" | "yong"

export * from "./sogo/autoplat"
export * from "./duoduo"
export * from "./rime"
export * from "./yong"
export * from "./raw-file"
export * from "./detect-plat"
export * from "./all-platforms"

export class FormatError extends Error {
  constructor() {
    super()
    this.name = "FormatError"
  }
}

export type PlatTypes = "auto" | "rime" | "duoduo" | "yong"

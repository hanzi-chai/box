import type { MbItem, TextMabiao } from "../../schema"

import type { DuoduoMeta } from "./mabiao-meta"

export interface MbItemDuoduo extends MbItem {
  meta: DuoduoMeta
}

export interface MbDuoduo extends TextMabiao {
  items: MbItemDuoduo[]
  plat: "duoduo"
}

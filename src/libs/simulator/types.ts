import type { MbItem } from "../schema"

export type SegCollection = SegValue[]
export enum SegKind {
  Mabiao = 0,
  CnPunc = 1,
  EnPunc = 2,
  UniPunc = 3,
  Lack = 4,
}

export type SegValue =
  | SegValueMabiao
  | SegValueLack
  | SegValuePunc

export type SegValuePunc = SegValueEnPunc | SegValueUniPunc | SegValueCnPunc

export type SegValueMabiao = [kind: SegKind.Mabiao, item: MbItem]
export type SegValueLack = [kind: SegKind.Lack, word: string]

export type SegValueEnPunc = [kind: SegKind.EnPunc, word: string]
export type SegValueUniPunc = [kind: SegKind.UniPunc, word: string]
export type SegValueCnPunc = [kind: SegKind.CnPunc, word: string]

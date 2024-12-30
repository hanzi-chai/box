/** 两键组合的类型，它们互斥 */
export enum ComboType {
  /** 小指干扰 */
  PinkyDisturb = 1,
  /** 同指小跨排 */
  SingleSpan = 2,
  /** 同指大跨排 */
  MultiSpan = 3,
  /** 错手 */
  LongFingersDisturb = 4,
  /** 左右互击 */
  DifferentHands = 5,
  /** 二连击 */
  DoubleHit = 6,
}

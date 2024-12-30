/** 码表里具体的每一项 */
export interface MbItem {
  /** 词语 */
  wd: string
  /** 编码 */
  cd: string
  /** 行数 */
  ln: number
  /** 词频 */
  freq?: number
  /** 方案自定义的存储空间 */
  meta?: object
  /** 命令直通车 */
  cmd?: unknown // TODO: 命令直通车的类
  /** 选重数 */
  collision?: number
}

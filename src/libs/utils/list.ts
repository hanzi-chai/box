export const createZerosArray = (length: number) => Array<number>(length).fill(0)

/** comments */
export function map<T, U>(array: T[], callback: (item: T, index: number, array: T[]) => U): U[] {
  const result: U[] = Array(array.length)
  for (let i = 0; i < array.length; i++) {
    result[i] = callback(array[i], i, array)
  }
  return result
}

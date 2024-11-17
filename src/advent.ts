export const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0)
export const product = (ns: number[]) => ns.reduce((a, b) => a * b, 1)

export function* tails(line: string) {
  for (let i = 0; i < line.length; i++) {
    yield line.slice(i, line.length)
  }
}

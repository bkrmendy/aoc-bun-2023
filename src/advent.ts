export const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0)
export const product = (ns: number[]) => ns.reduce((a, b) => a * b, 1)

export function* tails(line: string): Iterable<string> {
  for (let i = 0; i < line.length; i++) {
    yield line.slice(i, line.length)
  }
}

export function lines(input: string) {
  return input.split('\n').filter(l => l.length > 0)
}

export function words(line: string) {
  return line.split(' ').filter(w => w.length > 0)
}

export function* range(from: number, to: number): Iterable<number> {
  for (let i = from; i < to; i++) {
    yield i
  }
}

export function* matchAll(s: string, re: RegExp): Iterable<RegExpExecArray> {
  var match
  while ((match = re.exec(s)) != null) {
    yield match
  }
}

export function intersection(a: Set<any>, b: Set<any>) {
  return new Set([...a].filter(x => b.has(x)))
}

export function* zip<T, U>(a: T[], b: U[]): Iterable<[T, U]> {
  const length = Math.min(a.length, b.length)
  for (let i = 0; i < length; i++) {
    yield [a.at(i)!, b.at(i)!]
  }
}

export function maximum(numbers: number[]) {
  return Math.max(...numbers)
}

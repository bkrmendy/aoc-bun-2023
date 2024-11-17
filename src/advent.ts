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

export class Grid<T> {
  private constructor(private fromNestedArray: T[][]) {
    this.fromNestedArray = [...fromNestedArray.map(row => [...row])]
  }

  static from = <T>(nestedArray: T[][]) => new Grid(nestedArray)

  toNestedArray = () => [...this.fromNestedArray.map(row => [...row])]

  get = (row: number, col: number) => {
    return this.fromNestedArray.at(row)?.at(col) ?? null
  }

  set = (row: number, col: number, value: T) => {
    if (this.fromNestedArray.at(row) == null) {
      this.fromNestedArray[row] = []
    }

    this.fromNestedArray[row]![col] = value
  }

  neighbourhood = (row: number, col: number): Array<[number, number]> => {
    return [row - 1, row, row + 1].flatMap(iRow => {
      return [col - 1, col, col + 1].map((iCol): [number, number] => {
        return [iRow, iCol]
      })
    })
  };

  *[Symbol.iterator](): Generator<[T, number, number]> {
    for (let iRow = 0; iRow < this.fromNestedArray.length; iRow++) {
      const row = this.fromNestedArray.at(iRow)
      if (row != null) {
        for (let iCol = 0; iCol < row.length; iCol++) {
          const cell = row.at(iCol)
          if (cell != null) {
            yield [cell, iRow, iCol]
          }
        }
      }
    }
  }
}

import { lines, matchAll, range, sum } from '@/advent'

function isDigit(p: string) {
  return '0' <= p && p <= '9'
}

function isEmptySpace(p: string) {
  return p === '.'
}

const isPart = (p: string) => !isDigit(p) && !isEmptySpace(p)

const coordKey = (r: number, c: number) => `${r}-${c}`

function* parts(rows: string[]): Iterable<[string, number, number]> {
  for (const [iRow, row] of rows.entries()) {
    for (const [iCol, cell] of [...row].entries()) {
      if (isPart(cell)) {
        yield [cell, iRow, iCol]
      }
    }
  }
}

function numbers(rows: string[]): Record<string, [number, number, number]> {
  let result: Record<string, [number, number, number]> = {}
  for (const [iRow, row] of rows.entries()) {
    for (const match of matchAll(row, /\d+/g)) {
      const parsed = parseInt(match[0])
      for (const iCol of range(match.index, match.index + match[0].length)) {
        result[coordKey(iRow, iCol)] = [iRow, match.index, parsed]
      }
    }
  }

  return result
}

export const parse = (input: string) => {
  const ls = lines(input)
  return {
    parts: [...parts(ls)],
    numbers: numbers(ls)
  }
}

type Input = ReturnType<typeof parse>

function* neighbourhood(row: number, col: number): Iterable<[number, number]> {
  for (const r of [row - 1, row, row + 1]) {
    for (const c of [col - 1, col, col + 1]) {
      yield [r, c]
    }
  }
}

export function partOne(input: Input) {
  let neighborNumbers: Record<string, number> = {}
  for (const [_, pRow, pCol] of input.parts) {
    for (const [r, c] of neighbourhood(pRow, pCol)) {
      const number = input.numbers[coordKey(r, c)]
      if (number != null) {
        const [iRow, iCol, n] = number
        neighborNumbers[coordKey(iRow, iCol)] = n
      }
    }
  }

  return sum(Object.values(neighborNumbers))
}

function* gearRatios(input: Input) {
  const gears = input.parts.filter(([p]) => p === '*')

  for (const [_, pRow, pCol] of gears) {
    let neighborNumbers: Record<string, number> = {}

    for (const [r, c] of neighbourhood(pRow, pCol)) {
      const number = input.numbers[coordKey(r, c)]
      if (number != null) {
        const [iRow, iCol, n] = number
        neighborNumbers[coordKey(iRow, iCol)] = n
      }
    }

    const numbers = Object.values(neighborNumbers)
    if (numbers.length == 2) {
      yield numbers.at(0)! * numbers.at(1)!
    }
  }
}

export function partTwo(input: Input) {
  return sum([...gearRatios(input)])
}

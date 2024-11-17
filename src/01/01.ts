import { sum, tails } from '@/advent'

export function parse(input: string) {
  return input.split('\n').filter(l => l.length > 0)
}

const result = (first: number, second: number) => 10 * first + second

function solve(input: string[], numbers: (_: string) => number[]) {
  return sum(
    input.map(line => {
      const ns = numbers(line)
      return result(ns.at(0)!, ns.at(-1)!)
    })
  )
}

export function partOne(input: ReturnType<typeof parse>) {
  function numbers(line: string) {
    return [...line].filter(c => '1' <= c && c <= '9').map(c => parseInt(c))
  }
  return solve(input, numbers)
}

const mapping: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9
}

export function partTwo(input: ReturnType<typeof parse>) {
  function* numbers(line: string) {
    for (const tail of tails(line)) {
      for (const [from, value] of Object.entries(mapping)) {
        if (tail.startsWith(from)) {
          yield value
        }
      }
    }
  }
  return solve(input, l => [...numbers(l)])
}

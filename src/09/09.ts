import { lines, sum, words, zip } from '@/advent'

export function parse(input: string) {
  return lines(input).map(line => words(line).map(Number))
}

type Input = ReturnType<typeof parse>

const run =
  (c: (_: number[], __: number) => number) =>
  (nums: number[]): number => {
    let diffs: number[] = []
    for (const [a, b] of zip(nums, nums.slice(1))) {
      diffs.push(b - a)
    }

    if (diffs.every(d => d === 0)) {
      return c(nums, 0)
    }

    return c(nums, run(c)(diffs))
  }

const pt1 = (ns: number[], n: number) => ns.at(-1)! + n
const pt2 = (ns: number[], n: number) => ns.at(0)! - n
const solve = (c: (_: number[], __: number) => number) => (input: Input) =>
  sum(input.map(run(c)))

export const partOne = solve(pt1)
export const partTwo = solve(pt2)

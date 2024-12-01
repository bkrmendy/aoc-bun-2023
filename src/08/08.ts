import { lcm, lines } from '@/advent'

export function parse(
  input: string
): [string, Record<string, [string, string]>] {
  const [steps, ...mappings] = lines(input)
  const map: Record<string, [string, string]> = {}
  for (const line of mappings) {
    const [node, left, right] = line.matchAll(/[A-Z]+/g)
    if (node == null || left == null || right == null) {
      throw new Error(`Invalid line: ${line}`)
    }
    map[node[0]] = [left[0], right[0]]
  }
  return [steps!, map]
}

type Input = ReturnType<typeof parse>

function walk(end: (_: string) => boolean, from: string, input: Input): number {
  const [steps, map] = input
  let stepsTaken = 0
  let current = from
  while (!end(current)) {
    const node = map[current]
    if (node == null) {
      throw new Error(`No node found for ${current}`)
    }
    const [left, right] = node
    const direction = steps[stepsTaken % steps.length]
    current = direction === 'L' ? left : right
    stepsTaken += 1
  }
  return stepsTaken
}

function solve(
  start: (_: string) => boolean,
  end: (_: string) => boolean,
  input: Input
) {
  const [_, map] = input
  const starts = Object.keys(map).filter(start)
  const walks = starts.map(s => walk(end, s, input))
  return walks.reduce((acc, val) => lcm(acc, val))
}

export function partOne(input: Input) {
  return solve(
    a => a === 'AAA',
    a => a === 'ZZZ',
    input
  )
}

export function partTwo(input: Input) {
  return solve(
    a => a.endsWith('A'),
    a => a.endsWith('Z'),
    input
  )
}

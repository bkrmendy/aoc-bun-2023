import { lines, product, zip } from '@/advent'

export function parse(input: string): [number[], number[]] {
  const [time, distance] = lines(input)
  const ts = [...time!.matchAll(/\d+/g)!].map(Number)
  const ds = [...distance!.matchAll(/\d+/g)!].map(Number)
  return [ts, ds]
}

type Input = ReturnType<typeof parse>

function* race(total: number): Iterable<number> {
  for (let speed = 0; speed <= total; speed++) {
    yield (total - speed) * speed
  }
}

function beats(time: number, distance: number): number {
  return [...race(time)].filter(dst => dst > distance).length
}

export function partOne(input: Input) {
  const [times, distances] = input
  return product(
    [...zip(times, distances)].map(([time, distance]) => beats(time, distance))
  )
}

export function partTwo(input: Input) {
  const time = parseInt(input[0].map(n => n.toString()).join(''))
  const distance = parseInt(input[1].map(n => n.toString()).join(''))
  return [...race(time)].filter(dst => dst > distance).length
}

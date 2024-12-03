import { div, lines, unsafeGet, sum, zip } from '@/advent'
import { pipe, Match } from 'effect'

export interface Position {
  r: number
  c: number
}

interface Facing {
  h: -1 | 0 | 1
  v: -1 | 0 | 1
}

interface Elf {
  position: Position
  facing: Facing
}

const step: (position: Position, facing: Facing) => Position = (
  position,
  facing
) => ({
  r: position.r + facing.h,
  c: position.c + facing.v
})

const LEFT: Facing = { h: 0, v: -1 }
const RIGHT: Facing = { h: 0, v: 1 }
const UP: Facing = { h: -1, v: 0 }
const DOWN: Facing = { h: 1, v: 0 }

const DIRS: Record<string, (elf: Elf) => Elf> = {
  '|': ({ position, facing }) => ({
    facing,
    position: step(position, facing)
  }),
  '-': ({ position, facing }) => ({
    facing,
    position: step(position, facing)
  }),
  L: ({ position, facing }) => {
    const nextFacing = Match.value(facing).pipe(
      Match.when({ h: 0 }, () => UP),
      Match.orElse(() => RIGHT)
    )
    return { position: step(position, nextFacing), facing: nextFacing }
  },
  J: ({ position, facing }) => {
    const nextFacing = Match.value(facing).pipe(
      Match.when({ h: 0 }, () => UP),
      Match.orElse(() => LEFT)
    )
    return { position: step(position, nextFacing), facing: nextFacing }
  },
  '7': ({ position, facing }) => {
    const nextFacing = Match.value(facing).pipe(
      Match.when({ h: 0 }, () => DOWN),
      Match.orElse(() => LEFT)
    )
    return { position: step(position, nextFacing), facing: nextFacing }
  },
  F: ({ position, facing }) => {
    const nextFacing = Match.value(facing).pipe(
      Match.when({ h: 0 }, () => DOWN),
      Match.orElse(() => RIGHT)
    )
    return { position: step(position, nextFacing), facing: nextFacing }
  },
  S: ({ position, facing }) => ({ facing, position })
}

export function parse(input: string) {
  return lines(input).map(ls => [...ls].map(c => (DIRS[c] == null ? ' ' : c)))
}

type Input = ReturnType<typeof parse>

function walk(from: Position, toward: Facing, input: Input): Position[] {
  let elf: Elf = { position: step(from, toward), facing: toward }
  let current = input.at(elf.position.r)!.at(elf.position.c)!
  let positions: Position[] = []
  while (current != 'S') {
    positions.push(elf.position)
    elf = unsafeGet(DIRS, current)(elf)
    current = input.at(elf.position.r)!.at(elf.position.c)!
  }
  return positions
}

function findStartingPosition(input: string[][]) {
  let position: Position = { r: 0, c: 0 }
  input.forEach((r, ir) => {
    r.forEach((c, ic) => {
      if (c === 'S') {
        position = { r: ir, c: ic }
      }
    })
  })
  return position
}

export function partOne(input: Input) {
  return pipe(
    input,
    findStartingPosition,
    p => walk(p, LEFT, input),
    w => div(w.length, 2)
  )
}

export function partTwo(input: Input) {
  return pipe(
    input,
    findStartingPosition,
    position => walk(position, LEFT, input),
    ([start, ...rest]) => [start!, ...rest, start!],
    perimeter =>
      pipe(
        [...zip(perimeter, perimeter.slice(1))].map(
          ([p, pn]) => (p.c - pn.c) * (p.r + pn.r)
        ),
        sum,
        s => div(s, 2),
        s => s - div(perimeter.length, 2) + 1
      )
  )
}

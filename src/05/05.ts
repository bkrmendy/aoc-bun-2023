import { chunks, lines, minimum, words } from '@/advent'

interface Mapping {
  destination: number
  source: number
  rangeLength: number
}

interface Almanac {
  seeds: number[]
  sections: Array<{ mapping: Array<Mapping> }>
}

export function parse(input: string): Almanac {
  const pSeeds = (seeds: string) => {
    const [_, seed] = seeds.split(': ')
    return words(seed!).map(n => parseInt(n))
  }

  const pSection = (section: string) => {
    const ls = lines(section)
    return {
      mapping: ls
        .slice(1)
        .map((l): Mapping => {
          const m = words(l).map(n => parseInt(n))
          const [d, s, r] = m
          if (d == null || s == null || r == null) {
            throw new Error(`Invalid mapping: ${l}`)
          }
          return { destination: d, source: s, rangeLength: r }
        })
        .sort((a, b) => a.source - b.source)
    }
  }

  const sections = input.split('\n\n').filter(l => l.length > 0)
  return {
    seeds: pSeeds(sections.at(0)!),
    sections: sections.slice(1).map(pSection)
  }
}

type Input = ReturnType<typeof parse>

interface Range {
  from: number
  to: number
}

interface SplitRange {
  left: Range
  right: Range | null
}

function split(range: Range, at: number): SplitRange {
  if (range.to < at) {
    return { left: range, right: null }
  }
  return {
    left: { from: range.from, to: at },
    right: { from: at, to: range.to }
  }
}

function remap(range: Range, mapping: Mapping): Range {
  const m = (p: number) => p - mapping.source + mapping.destination
  return { from: m(range.from), to: m(range.to) }
}

function mapRange(range: Range, mappings: Array<Mapping>): SplitRange {
  for (const mapping of mappings) {
    const { source, rangeLength } = mapping
    if (source <= range.from && range.from < source + rangeLength) {
      const { left, right } = split(range, source! + rangeLength!)
      return {
        left: remap(left, mapping),
        right: right
      }
    }
  }
  return { left: range, right: null }
}

function mapRanges(ranges: Range[], mappings: Array<Mapping>): Range[] {
  const rangesToMap = [...ranges]
  const mappedRanges: Range[] = []
  while (rangesToMap.length > 0) {
    const range = rangesToMap.shift()!
    const { left, right } = mapRange(range, mappings)
    mappedRanges.push(left)
    if (right != null) {
      rangesToMap.unshift(right)
    }
  }
  return mappedRanges
}

function mapSeedRange(range: Range, sections: Almanac['sections']): Range[] {
  return sections.reduce(
    (acc, { mapping }) => {
      return mapRanges(acc, mapping)
    },
    [range]
  )
}

export function partOne(input: Input) {
  const { seeds, sections } = input
  const ranges = seeds.map(seed => ({ from: seed, to: seed + 1 }))
  const remapped = ranges
    .flatMap(range => mapSeedRange(range, sections))
    .map(r => r.from)
  return minimum(remapped)
}

export function partTwo(input: Input) {
  const { seeds, sections } = input
  const ranges = chunks(seeds, 2).map(([from, range]) => ({
    from: from!,
    to: from! + range!
  }))
  const remapped = ranges
    .flatMap(range => mapSeedRange(range, sections))
    .map(r => r.from)
  return minimum(remapped)
}

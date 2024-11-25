import { lines, maximum, sum, zip } from '@/advent'

interface Play {
  hand: string
  bid: number
}

export function parse(input: string): Play[] {
  return lines(input).map(line => {
    const [hand, bid] = line.split(' ')
    return { hand: hand!, bid: parseInt(bid!) }
  })
}

function rating(letters: Array<[string, number]>): number {
  if (letters.some(([_, count]) => count === 5)) {
    return 7
  }

  if (letters.some(([_, count]) => count === 4)) {
    return 6
  }

  if (
    letters.some(([_, count]) => count === 3) &&
    letters.some(([_, count]) => count === 2)
  ) {
    return 5
  }

  if (letters.some(([_, count]) => count === 3)) {
    return 4
  }

  const maybePairOne = letters.find(([_, count]) => count === 2)
  if (
    maybePairOne != null &&
    letters.some(([letter, count]) => count === 2 && letter !== maybePairOne[0])
  ) {
    return 3
  }

  if (maybePairOne != null) {
    return 2
  }

  return 1
}

function rankingPt1(hand: string): number {
  let letters: Array<[string, number]> = Object.entries(
    [...hand].reduce((acc: Record<string, number>, letter) => {
      acc[letter] = (acc[letter] ?? 0) + 1
      return acc
    }, {})
  )
  return rating(letters)
}

const sortPlay =
  (strengths: string[], ranking: (_: string) => number) =>
  (left: Play, right: Play): number => {
    const leftRank = ranking(left.hand)
    const rightRank = ranking(right.hand)
    if (leftRank !== rightRank) {
      return leftRank - rightRank
    }

    for (const [a, b] of zip([...left.hand], [...right.hand])) {
      if (a !== b) {
        return strengths.indexOf(a) - strengths.indexOf(b)
      }
    }
    return 0
  }

type Input = ReturnType<typeof parse>

const letters = [...'23456789TQKA']

function subs(hand: string[]): string[] {
  if (hand.length === 0) {
    return ['']
  }

  if (!hand.includes('J')) {
    return [hand.join('')]
  }

  const [head, ...tail] = hand
  if (head === 'J') {
    return subs(tail).flatMap(sub => letters.map(letter => letter + sub))
  }
  return subs(tail).map(sub => head + sub)
}

function rankingPt2(hand: string): number {
  const jokers = [...hand].filter(letter => letter === 'J').length
  if (jokers === 5) {
    return 7
  }

  return maximum(subs([...hand]).map(rankingPt1))
}

const solve =
  (strengths: string[], ranking: (_: string) => number) => (input: Input) => {
    return sum(
      input
        .sort(sortPlay(strengths, ranking))
        .map((play, idx) => play.bid * (idx + 1))
    )
  }

export const partOne = solve([...'23456789TJQKA'], rankingPt1)

export const partTwo = solve([...'J23456789TQKA'], rankingPt2)

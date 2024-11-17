import { intersection, lines, sum, words } from '@/advent'

interface Card {
  winning: number[]
  numbers: number[]
}

export function parse(input: string): Card[] {
  return lines(input).map(line => {
    const [_, dataStr] = line.split(': ')
    const [winningStr, numbersStr] = dataStr!.split(' | ')
    const winning = words(winningStr!).map(n => parseInt(n))
    const numbers = words(numbersStr!).map(n => parseInt(n))
    return { winning, numbers }
  })
}

type Input = ReturnType<typeof parse>

const points = (total: number) => (total == 0 ? 0 : Math.pow(2, total - 1))

export const partOne = (input: Input) =>
  sum(
    input.map(({ winning, numbers }) =>
      points(intersection(new Set(winning), new Set(numbers)).size)
    )
  )

export function partTwo(input: Input) {
  let cards: number[] = Array(input.length).fill(1)
  
  for (const [i, { winning, numbers }] of input.entries()) {
    const score = intersection(new Set(winning), new Set(numbers)).size
    for (let idx = i + 1; idx <= i + score; idx++) {
      if (idx < cards.length) {
        cards[idx]! += cards[i]!
      }
    }
  }

  return sum(cards)
}

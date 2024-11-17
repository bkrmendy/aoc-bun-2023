import { lines, product, sum } from '@/advent'

const Colors = ['red', 'green', 'blue'] as const
type Color = (typeof Colors)[number]

interface Cube {
  color: Color
  amount: number
}

interface Game {
  cubes: Cube[]
}

export function parse(input: string): Game[] {
  const isColor = (color: any): color is Color => Colors.includes(color)

  const pDraw = (raw: string) =>
    raw.split(', ').map(c => {
      const [amount, color] = c.split(' ')
      if (!isColor(color)) {
        throw new Error(`Invalid color: ${color}`)
      }

      return { color, amount: parseInt(amount!) }
    })

  return lines(input).map(l => {
    const [_, cubesStr] = l.split(': ')
    const cubes = cubesStr!.split('; ').flatMap(pDraw)
    return { cubes }
  })
}

type Input = ReturnType<typeof parse>

export function partOne(input: Input) {
  const limits = { red: 12, green: 13, blue: 14 }
  return sum(
    input.flatMap((game, id) =>
      game.cubes.every(cube => cube.amount <= limits[cube.color])
        ? [id + 1]
        : []
    )
  )
}

interface Fewest {
  red: number | null
  green: number | null
  blue: number | null
}

export function partTwo(input: Input) {
  return sum(
    input.map(game => {
      let fewest: Fewest = { red: null, green: null, blue: null }
      for (const cube of game.cubes) {
        const amount = fewest[cube.color]
        fewest[cube.color] =
          amount == null ? cube.amount : Math.max(amount, cube.amount)
      }
      return product([fewest.red ?? 1, fewest.green ?? 1, fewest.blue ?? 1])
    })
  )
}

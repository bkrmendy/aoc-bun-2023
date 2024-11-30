import * as Day1 from '../src/01/01'
import Day1Input from '../src/01/input.txt'
import * as Day2 from '../src/02/02'
import Day2Input from '../src/02/input.txt'
import * as Day3 from '../src/03/03'
import Day3Input from '../src/03/input.txt'
import * as Day4 from '../src/05/05'
import Day4Input from '../src/05/input.txt'
import * as Day5 from '../src/05/05'
import Day5Input from '../src/05/input.txt'

import { formatPerformance, withPerformance } from './utils'

const days: Array<[any, (_: any) => any, (_: any) => any]> = [
  [Day1.parse(Day1Input), Day1.partOne, Day1.partTwo],
  [Day2.parse(Day2Input), Day2.partOne, Day2.partTwo],
  [Day3.parse(Day3Input), Day3.partOne, Day3.partTwo],
  [Day4.parse(Day4Input), Day4.partOne, Day4.partTwo],
  [Day5.parse(Day5Input), Day5.partOne, Day5.partTwo]
]

const [_, performance] = withPerformance(() => {
  for (const [input, partOne, partTwo] of days) {
    console.log('Part One:', partOne(input))
    console.log('Part Two:', partTwo(input))
  }
})

console.log(formatPerformance(performance))

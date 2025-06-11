interface ChartProps {
  onOpen: () => void
  refines: boolean[]
}

interface CumulativeData {
  time: number
  score: number
  type: string
}

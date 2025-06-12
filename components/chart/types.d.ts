interface ChartProps {
  onOpen: () => void
  loading: boolean
}

interface CumulativeData {
  time: number
  score: number
  type: string
}

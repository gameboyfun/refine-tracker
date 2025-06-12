import { useRefineStore } from '@/store/refineStore'
import { useDisclosure } from '@heroui/react'
import { useMemo, useState } from 'react'

export default function useBusinessLogic() {
  const { refines, clearRefines } = useRefineStore()
  const [maxEntries, setMaxEntries] = useState('')
  const periods = [
    { label: 'All', key: '' },
    { label: '15', key: '15' },
    { label: '30', key: '30' },
    { label: '45', key: '45' },
    { label: '60', key: '60' },
    { label: '100', key: '100' },
    { label: '200', key: '200' },
    { label: '300', key: '300' }
  ]
  const {isOpen, onOpen, onOpenChange} = useDisclosure()

  // Calculate EMA12
  const calculateEMA = (data: number[], period: number) => {
    const multiplier = 2 / (period + 1)
    const ema = []

    if (data.length < period) return [] // Return empty if not enough data

    // Calculate SMA for the first 'period' values
    const smaSum = data.slice(0, period).reduce((sum, val) => sum + val, 0)
    ema[period - 1] = smaSum / period

    // Calculate EMA for remaining values
    for (let i = period; i < data.length; i++) {
      ema[i] = data[i] * multiplier + ema[i - 1] * (1 - multiplier)
    }

    return ema
  }

  // Create cumulative success data
  const cumulativeData = useMemo(
    () =>
      refines.reduce<CumulativeData[]>(
        (acc, refine, index) => {
          const newScore: number = refine ? 1 : -1
          const previousScore = acc[index].score

          return [
            ...acc,
            {
              time: acc.length,
              score: previousScore + newScore,
              type: refine ? 'success' : 'fail'
            }
          ]
        },
        [
          {
            time: 0,
            score: 0,
            type: 'init'
          }
        ]
      ),
    [refines]
  )

  // Filter to show only the specified number of newest entries
  const filteredData = !maxEntries ? cumulativeData : cumulativeData.slice(-maxEntries)

  // Calculate EMA12 for the filtered scores
  const ema12Values = useMemo(
    () =>
      calculateEMA(
        cumulativeData.map((item) => item.score),
        12
      ),
    [cumulativeData]
  )

  // Add EMA12 to the data (only for entries that have EMA12 calculated)
  const chartData = useMemo(() => {
    const emaValuesForChart = maxEntries ? ema12Values.slice(-Number(maxEntries)) : ema12Values

    return filteredData.map((item, index) => ({
      ...item,
      ema12: emaValuesForChart[index] !== undefined ? emaValuesForChart[index] : null
    }))
  }, [maxEntries, ema12Values, filteredData])

  const shouldShowEMA12 = chartData.length - 1 >= 12

  const handleMaxEntriesChange = (value: string) => {
    setMaxEntries(value)
  }

  const clearHistory = () => {
    clearRefines()
  }

  return {
    periods,
    refines,
    filteredData,
    chartData,
    shouldShowEMA12,
    handleMaxEntriesChange,
    clearHistory,
    isOpen,
    onOpen,
    onOpenChange
  }
}

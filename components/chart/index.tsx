import { useMemo, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardBody, CardHeader, Select, SelectItem } from '@heroui/react'

export const Chart = ({ refines }: ChartProps) => {
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
              time: acc.length + 1,
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
  const scores = cumulativeData.map((item) => item.score)
  const ema12Values = calculateEMA(scores, 12)

  // Add EMA12 to the data (only for entries that have EMA12 calculated)
  const chartData = filteredData.map((item, index) => ({
    ...item,
    ema12: ema12Values[index] !== undefined ? ema12Values[index] : null
  }))

  // Check if we should show EMA12 line
  // const shouldShowEMA12 = cumulativeData.length >= 12
  const shouldShowEMA12 = true

  const handleMaxEntriesChange = (value: string) => {
    setMaxEntries(value)
  }

  if (refines.length === 1) {
    return (
      <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
        <CardHeader>
          <h3 className='text-2xl font-semibold text-white'>Refining Performance</h3>
        </CardHeader>
        <CardBody className='flex items-center justify-center h-64'>
          <p className='text-slate-400'>
            No refines recorded yet. Start refines to see your performance!
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
      <CardHeader className='p-6'>
        <h3 className='text-2xl font-semibold text-white'>Refining Performance</h3>
      </CardHeader>
      <CardBody className='p-6'>
        <div className='space-y-4'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <h3 className='text-slate-300 text-sm font-medium'>
              Cumulative Success Score Over Time
              {filteredData.length < refines.length && (
                <div className=' text-slate-400'>(showing last {filteredData.length} refines)</div>
              )}
            </h3>
            <div className='flex items-center gap-2'>
              <label htmlFor='maxEntries' className='text-slate-300 text-sm whitespace-nowrap'>
                Show:
              </label>
              <Select
                aria-label='max-entries'
                size='sm'
                className='w-20'
                defaultSelectedKeys={['']}
                onChange={(e) => handleMaxEntriesChange(e.target.value)}
              >
                {periods.map(({ key, label }) => (
                  <SelectItem key={key} aria-label={label}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#475569' />
              <XAxis dataKey='time' stroke='#94a3b8' fontSize={12} />
              <YAxis stroke='#94a3b8' fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#e2e8f0'
                }}
                labelFormatter={(value) => `Refine times: ${value}`}
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toFixed(2) : value,
                  name === 'score' ? 'Score' : 'EMA12'
                ]}
              />
              <Line
                type='monotone'
                dataKey='score'
                stroke='#3b82f6'
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e40af' }}
              />
              {/* {shouldShowEMA12 && ( */}
              <Line
                type='monotone'
                dataKey='ema12'
                stroke='#f59e0b'
                strokeWidth={2}
                dot={false}
                strokeDasharray='5 5'
                connectNulls={false}
              />
              {/* )} */}
            </LineChart>
          </ResponsiveContainer>
          <div className='text-xs text-slate-400 mt-2'>
            <div>Success refines: +1 point • Failed refines: -1 point</div>
            {shouldShowEMA12 ? (
              <div>EMA12: 12-period Exponential Moving Average (orange dashed line)</div>
            ) : (
              <div>
                EMA12: Requires at least 12 refines to display ({cumulativeData.length - 1}/12)
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

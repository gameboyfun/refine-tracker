import { Card, CardBody } from '@heroui/react'
import { CheckIcon, XMarkIcon, ChartBarIcon, ChartPieIcon } from '@heroicons/react/24/outline'

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'check':
        return <CheckIcon className='w-6 h-6' />
      case 'x':
        return <XMarkIcon className='w-6 h-6' />
      case 'chart-bar':
        return <ChartBarIcon className='w-6 h-6' />
      case 'chart-pie':
        return <ChartPieIcon className='w-6 h-6' />
    }
  }

  return (
    <Card
      className={`border text-${color}-400 bg-${color}/10 border-${color}/20 backdrop-blur-sm`}
    >
      <CardBody className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-slate-300 text-sm font-medium'>{title}</p>
            <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-${color}/20`}>{getIcon()}</div>
        </div>
      </CardBody>
    </Card>
  )
}

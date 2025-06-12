import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Button,
  Spinner,
  Tooltip as TooltipHeroUI,
  Modal,
  ModalContent,
  ModalBody
} from '@heroui/react'
import { ClockIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import useBusinessLogic from './logic'

export const Chart = ({ onOpen, loading = true }: ChartProps) => {
  const {
    periods,
    refines,
    filteredData,
    chartData,
    shouldShowEMA12,
    handleMaxEntriesChange,
    clearHistory,
    isOpen,
    onOpen: onOpenModal,
    onOpenChange
  } = useBusinessLogic()

  const renderCardHeader = () => (
    <CardHeader className='p-6 flex justify-between'>
      <h3 className='text-2xl font-semibold text-white'>Refining Performance</h3>
      <div>
        <TooltipHeroUI content='History' placement='bottom' showArrow={true}>
          <Button variant='light' isIconOnly onPress={onOpen}>
            <ClockIcon className='w-4 h-4' />
          </Button>
        </TooltipHeroUI>
        {!loading && Boolean(refines.length) && (
          <TooltipHeroUI content='Clear History' placement='bottom' showArrow={true}>
            <Button variant='light' color='danger' isIconOnly onPress={onOpenModal}>
              <TrashIcon className='w-4 h-4' />
            </Button>
          </TooltipHeroUI>
        )}
      </div>
    </CardHeader>
  )

  if (loading) {
    return (
      <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
        {renderCardHeader()}
        <CardBody className='p-6 flex items-center justify-center h-64'>
          <Spinner
            classNames={{ base: 'absolute flex align-center justify-center' }}
            variant='spinner'
            label='Loading...'
          />
        </CardBody>
      </Card>
    )
  }

  if (!loading && refines.length === 0) {
    return (
      <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
        {renderCardHeader()}
        <CardBody className='p-6 flex items-center justify-center h-64'>
          <p className='text-slate-400'>
            No refines recorded yet. Start refines to see your performance!
          </p>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm'>
        {renderCardHeader()}
        <CardBody className='p-6'>
          <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <h3 className='text-slate-300 text-sm font-medium'>
                Cumulative Success Score Over Time
                {filteredData.length < refines.length && (
                  <div className=' text-slate-400'>
                    (showing last {filteredData.length} refines)
                  </div>
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
                <Line
                  type='monotone'
                  dataKey='ema12'
                  stroke='#f59e0b'
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray='5 5'
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className='text-xs text-slate-400 mt-2'>
              <div>Success refines: +1 point • Failed refines: -1 point</div>
              {shouldShowEMA12 ? (
                <div>EMA12: 12-period Exponential Moving Average (orange dashed line)</div>
              ) : (
                <div>
                  EMA12: Requires at least 12 refines to display ({chartData.length - 1}/12)
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        backdrop='blur'
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className='flex-col p-8'>
                <div className='my-4 self-center flex flex-col items-center'>
                  <QuestionMarkCircleIcon className='w-20 h-20 text-warning-400' />
                  <h3 className='text-2xl font-semibold text-white'>Clear History?</h3>
                </div>
                <div className='flex gap-2'>
                  <Button className='xs:w-full w-1/2' onPress={onClose} color='danger'>
                    Cancel
                  </Button>
                  <Button
                    className='xs:w-full w-1/2'
                    onPress={() => {
                      clearHistory()
                      onClose()
                    }}
                    color='primary'
                  >
                    Confirm
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

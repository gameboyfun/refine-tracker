'use client'

import useBusinessLogic from './logic'
import { RefineButton } from '@/components/refineButton'
import { StatsCard } from '@/components/statsCard'
import { RefineHistory } from '@/components/refineHistory'
import { Chart } from '@/components/chart'
import ManageDataSection from '@/components/importButton'

export default function Home() {
  const { refines, addRefine, setRefines, getStats, editRefine, isOpen, onOpen, onOpenChange } =
    useBusinessLogic()
  const { successRefines, failRefines, totalRefines, successRate, successColor } = getStats()

  return (
    <div className='max-w-7xl mx-auto'>
      {/* <audio controls autoPlay loop>
        <source src='/sounds/prontera-bgm.mp3' type='audio/mp3' />
      </audio> */}
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <div className='text-center flex-1'>
          <h1 className='text-4xl font-bold text-white mb-2'>Refine Tracker</h1>
          <p className='text-blue-200'>Monitor your refine performance and success rate</p>
        </div>
        <ManageDataSection refines={refines} onImportSuccess={(value) => setRefines(value)} />
      </div>

      {/* Action Buttons */}
      <div className='flex justify-center gap-6 mb-8'>
        <RefineButton type='success' onClick={() => addRefine('success')} />
        <RefineButton type='fail' onClick={() => addRefine('fail')} />
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <StatsCard title='Total Refines' value={totalRefines} icon='chart-bar' color='primary' />
        <StatsCard title='Success Rate' value={successRate} icon='chart-pie' color={successColor} />
        <StatsCard title='Successful' value={successRefines} icon='check' color='success' />
        <StatsCard title='Failed' value={failRefines} icon='x' color='danger' />
      </div>

      {/* Chart and History */}
      <Chart onOpen={onOpen} refines={refines} />
      <RefineHistory
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        refines={refines}
        onEditRefine={editRefine}
      />
    </div>
  )
}

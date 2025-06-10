import { Button } from '@heroui/react'
import useBusinessLogic from './logic'
import { DocumentArrowDownIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'

export default function ManageDataButton({ refines, onImportSuccess }: ManageDataButtonProps) {
  const { fileInputRef, handleFileSelect, handleClick, exportTrades } = useBusinessLogic({ refines, onImportSuccess})

  return (
    <div className='absolute top-4 right-4 flex gap-2'>
      <input
        ref={fileInputRef}
        type='file'
        accept='.json'
        onChange={handleFileSelect}
        className='hidden'
      />
      <Button onPress={handleClick} variant='ghost' color='default'>
        Import <DocumentArrowDownIcon className='w-4 h-4' />
      </Button>
      <Button onPress={exportTrades} variant='ghost' color='default'>
        Export <DocumentArrowUpIcon className='w-4 h-4' />
      </Button>
    </div>
  )
}

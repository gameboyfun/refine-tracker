import { Button } from '@heroui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export const RefineButton = ({ type, onClick }: RefineButtonProps) => {
  const isSuccess = type === 'success'

  return (
    <Button
      variant='shadow'
      onPress={onClick}
      size='lg'
      color={type === 'success' ? 'success' : 'danger'}
      className={`relative h-20 w-40 text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95`}
    >
      <div className='flex flex-col items-center gap-1'>
        {isSuccess ? <CheckIcon className='w-6 h-6' /> : <XMarkIcon className='w-6 h-6' />}
        <span>{isSuccess ? 'Success' : 'Failed'}</span>
      </div>
    </Button>
  )
}

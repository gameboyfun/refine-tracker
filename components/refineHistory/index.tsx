import { Button, Card, CardBody, CardHeader, ScrollShadow } from '@heroui/react'
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import useBusinessLogic from './logic'

export const RefineHistory = ({ refines, onEditRefine }: RefineHistoryProps) => {
  const { editingId, recentRefines, handleEdit, handleSave, handleCancel } = useBusinessLogic(
    refines,
    onEditRefine
  )

  return (
    <Card className='bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full'>
      <CardHeader className='flex flex-row items-center justify-between p-6'>
        <h3 className='text-2xl font-semibold text-white'>Recent Refines</h3>
      </CardHeader>
      <CardBody className='h-full p-6'>
        {recentRefines.length === 0 ? (
          <div className='h-[400px] lg:h-[380px] flex flex-col justify-center'>
            <p className='text-slate-400 text-center py-8'>No refines recorded</p>
          </div>
        ) : (
          <ScrollShadow className='h-[400px] lg:h-[380px] scrollbar-hide'>
            <div className='space-y-3'>
              {recentRefines.map((refine, index) => {
                const classType = refine ? 'success' : 'danger'

                // if (type === 'initial') return

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border bg-${classType}/10 border-${classType}/20`}
                  >
                    <div className='flex items-center gap-3'>
                      <div className={`p-1 rounded-full bg-${classType}/20`}>
                        {refine ? (
                          <CheckIcon className={`w-4 h-4 text-${classType}`} />
                        ) : (
                          <XMarkIcon className={`w-4 h-4 text-${classType}`} />
                        )}
                      </div>
                      {editingId === index ? (
                        <div className='flex items-center gap-2'>
                          <Button
                            size='sm'
                            variant='bordered'
                            onPress={() => handleSave(index, 'success')}
                            color='success'
                          >
                            Success
                          </Button>
                          <Button
                            size='sm'
                            variant='bordered'
                            onPress={() => handleSave(index, 'fail')}
                            color='danger'
                          >
                            Fail
                          </Button>
                        </div>
                      ) : (
                        <span className={`font-medium text-${classType}-400`}>
                          {refine ? 'Success' : 'Fail'}
                        </span>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      {/* <div className='text-slate-400 text-sm'>{refineDatetime}</div> */}
                      {editingId !== index ? (
                        <Button size='sm' variant='light' onPress={() => handleEdit(index)} isIconOnly>
                          <PencilIcon className='w-4 h-4' />
                        </Button>
                      ) : (
                        <Button
                          size='sm'
                          variant='ghost'
                          onPress={handleCancel}
                          className='text-slate-400 hover:text-slate-300 h-8 w-8 p-0'
                          isIconOnly
                        >
                          <XMarkIcon className='w-4 h-4' />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollShadow>
        )}
      </CardBody>
    </Card>
  )
}

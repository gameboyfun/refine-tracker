'use client'

import { addToast, useDisclosure } from '@heroui/react'
import dayjs from 'dayjs'
import throttle from 'lodash/throttle'
import { useCallback, useState } from 'react'

export default function useBusinessLogic() {
  const [refines, setRefines] = useState<boolean[]>([])
  const {isOpen, onOpen, onOpenChange} = useDisclosure()

  const addRefine = useCallback(
    throttle((type: SuccessType) => {
      setRefines((prev) => [...prev, type === 'success'])

      addToast({
        title: type === 'success' ? 'Refine Successful' : 'Refine Failed',
        description: `Recorded at ${dayjs().format('DD/MM/YYYY HH:mm:ss')}`,
        variant: 'flat',
        color: type === 'success' ? 'success' : 'danger',
        timeout: 2000
      })

      // const audio = new Audio(`/sounds/refine-${type}.mp3`)
      // audio.play()
    }, 1000),
    []
  )

  const getStats = (): RefineStats => {
    const totalRefines = refines.length
    const totalSuccess = refines.filter((refine) => refine === true).length
    const totalFail = refines.filter((refine) => refine === false).length
    const successRate = (totalSuccess / totalRefines) * 100

    const successRefines = `${totalSuccess}`
    const failRefines = `${totalFail}`
    const successRateString = totalRefines > 0 ? `${successRate.toFixed(2)}%` : `0.00%`

    const successColor = (() => {
      if (totalRefines === 0) return 'secondary'
      else if (successRate === 50) return 'warning'

      return successRate >= 50 ? 'success' : 'danger'
    })()

    return {
      successRefines,
      failRefines,
      totalRefines: `${totalRefines}`,
      successRate: successRateString,
      successColor
    }
  }

  const editRefine = (index: number, newType: SuccessType) => {
    setRefines((prev) => {
      const temp = [...prev]
      temp[refines.length - 1 - index] = newType === 'success'
      return temp
    })

    addToast({
      title: 'Refine Updated',
      description: `Refine changed to ${newType}`,
      color: newType === 'success' ? 'success' : 'danger',
      timeout: 2000
    })
  }

  return {
    refines,
    addRefine,
    setRefines,
    getStats,
    editRefine,
    isOpen,
    onOpen,
    onOpenChange
  }
}

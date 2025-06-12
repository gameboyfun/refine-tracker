'use client'

import { addToast, useDisclosure } from '@heroui/react'
import dayjs from 'dayjs'
import throttle from 'lodash/throttle'
import { useCallback, useEffect, useState } from 'react'
import { useRefineStore } from '../store/refineStore'

export default function useBusinessLogic() {
  const [loading, setLoading] = useState(true)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { refines, editRefineToStore, addRefineToStore } = useRefineStore()

  useEffect(() => {
    setLoading(false)
  }, [refines])

  const addRefine = useCallback(
    throttle((type: SuccessType) => {
      addRefineToStore(type === 'success')

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
    editRefineToStore(refines.length - 1 - index, newType === 'success')

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
    getStats,
    editRefine,
    isOpen,
    onOpen,
    onOpenChange,
    loading
  }
}

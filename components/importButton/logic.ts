import { addToast } from '@heroui/react'
import { useRef } from 'react'

export default function useBusinessLogic({ refines, onImportSuccess }: ManageDataButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportError = (message: string) => {
    addToast({
      title: 'Import Error',
      description: message,
      variant: 'flat'
    })
  }

  const importData = (importData: boolean[]) => {
    onImportSuccess(importData)
    addToast({
      title: 'Refines Imported',
      description: `Successfully imported ${importData.length} refines`
    })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/json') {
      handleImportError('Please select a valid JSON file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content) as boolean[]

        importData(data)
      } catch (error) {
        console.log('🚀 ~ handleFileSelect ~ error:', error)
        handleImportError('Invalid JSON format or structure')
      }
    }

    reader.readAsText(file)

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const exportData = () => {
    const dataStr = JSON.stringify(refines)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

    const exportFileDefaultName = `refines-history-${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()

    addToast({
      title: 'Refines Exported',
      description: `Downloaded ${refines?.length} refines to ${exportFileDefaultName}`
    })
  }

  return {
    fileInputRef,
    handleFileSelect,
    handleClick,
    exportData
  }
}

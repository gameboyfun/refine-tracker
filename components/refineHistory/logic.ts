import { useMemo, useState } from 'react'

export default function useBusinessLogic(
  refines: boolean[],
  onEditRefine: (id: number, newType: SuccessType) => void
) {
  const [editingId, setEditingId] = useState<number>()
  const recentRefines = useMemo(() => {
    return [...refines].reverse()
  }, [refines])

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleSave = (id: number, newType: SuccessType) => {
    onEditRefine(id, newType)
    setEditingId(undefined)
  }

  const handleCancel = () => {
    setEditingId(undefined)
  }

  return {
    editingId,
    recentRefines,
    handleEdit,
    handleSave,
    handleCancel
  }
}

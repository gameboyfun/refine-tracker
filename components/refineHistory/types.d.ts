interface RefineHistoryProps {
  isOpen: boolean
  onOpenChange: () => void
  refines: boolean[]
  onEditRefine: (id: number, newType: SuccessType) => void
}

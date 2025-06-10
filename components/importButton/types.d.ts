interface ManageDataButtonProps {
  refines?: boolean[]
  onImportSuccess: (value: boolean[]) => void
}

type RawData = 1 | -1

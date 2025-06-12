interface RefineStore {
  refines: boolean[]
  addRefineToStore: (status: boolean) => void
  editRefineToStore: (index: number, status: boolean) => void
  setRefinesToStore: (refines: boolean[]) => void
  clearRefines: () => void
}

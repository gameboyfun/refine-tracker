import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useRefineStore = create<RefineStore>()(
  persist(
    (set) => ({
      refines: [],

      addRefineToStore: (status: boolean) =>
        set((state) => ({ refines: [...state.refines, status] })),
      editRefineToStore: (index: number, status: boolean) =>
        set((state) => ({
          refines: state.refines.map((item, i) => (i === index ? status : item))
        })),
      setRefinesToStore: (refines: boolean[]) => set(() => ({ refines: refines })),
      clearRefines: () => set(() => ({ refines: [] }))
    }),
    {
      name: 'refine-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

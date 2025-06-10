interface RouterConfig {
  routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>
}

interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

type SuccessType = 'success' | 'fail' | 'initial'

type Color = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning'

interface Refine {
  id: number
  type: SuccessType
  timestamp: Dayjs
}

interface RefineStats {
  successRefines: string
  failRefines: string
  totalRefines: string
  successRate: string
  successColor: Color
}

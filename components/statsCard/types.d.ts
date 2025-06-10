type Icon = 'check' | 'x' | 'chart-bar' | 'chart-pie'

interface StatsCardProps {
  title: string
  value: string
  icon: Icon
  color: Color
}
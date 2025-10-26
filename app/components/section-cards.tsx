import { motion } from "framer-motion";
import { Badge } from "@/app/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"

interface StatCard {
  label: string
  value: string | number
  subtitle?: string
  icon?: React.ElementType
  color?: string
  bg?: string
}

export function SectionCards({ statsData }: { statsData: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
      {statsData.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className={`p-6 w-full transition-all duration-300 hover:shadow-xl border border-gray-200 group ${stat.bg ?? "bg-white"}`}>
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium text-gray-600">
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </CardTitle>
                {Icon && (
                  <CardAction className="mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs px-3 py-1.5 flex items-center gap-2 rounded-full border-2 ${stat.color ?? "text-green-600 border-green-200 bg-green-50"} group-hover:scale-105 transition-transform duration-200`}
                    >
                      <Icon className="size-4" />
                      {stat.subtitle}
                    </Badge>
                  </CardAction>
                )}
              </CardHeader>
              {stat.subtitle && !Icon && (
                <CardFooter className="flex-col items-start gap-1 text-sm text-gray-600 pt-2">
                  <div className="flex gap-2 items-center font-medium text-gray-900">
                    {stat.subtitle}
                  </div>
                </CardFooter>
              )}
              
              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-300 rounded-b-lg" />
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
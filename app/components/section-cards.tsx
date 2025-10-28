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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="p-5 w-full transition-all duration-200 hover:shadow-md border border-slate-200 bg-white">
              <CardHeader className="pb-3 p-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-100">
                    {Icon && <Icon className="w-5 h-5 text-slate-600" />}
                  </div>
                  <div>
                    <CardDescription className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      {stat.value}
                    </CardTitle>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">{stat.subtitle}</p>
              </CardHeader>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
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
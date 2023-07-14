import { Row } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

interface DataTableScoreBadgeProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    row: Row<TData>
  }

export default function ScoreBadge<TData>({ row }: DataTableScoreBadgeProps<TData>) {
    const score = row.getValue("score") as number

    return (
        <Badge
            variant="outline"
            className={`text-white text-xs
                ${
                    score > 80 ? "bg-green-600" : 
                    score > 65 ? "bg-green-500" :
                    score >= 55 ? "bg-green-400" :
                    score >= 45 ? "bg-gray-400" :
                    score > 35 ? "bg-red-500" :
                    score > 20 ? "bg-red-600" :
                    "bg-red-700"
                }
            `}
        >
            {row.getValue("score")}
        </Badge>
    )
}
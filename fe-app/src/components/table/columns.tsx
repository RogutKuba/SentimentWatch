"use client"

import { ColumnDef } from "@tanstack/react-table"
import DataTableColumnHeader from "./ColumnHeader"
import ScoreBadge from "@/components/table/ScoreBadge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AnalyzedArticle = {
  id: string
  url: string
  ticker: string
  compnay_name: string
  score: number
  pros: string[]
  cons: string[]
  datetime: number
  headline: string
}

export const columns: ColumnDef<AnalyzedArticle>[] = [
  {
    id: "headline",
    accessorKey: "headline",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Headline" />
    ),
    cell: ({ row }) => (
      <a href={row.getValue("url")} target="_blank">
        <span>{row.getValue("headline")}</span>
      </a>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "url",
    accessorKey: "url",
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "ticker",
    accessorKey: "ticker",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticker"/>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "company",
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "score",
    accessorKey: "score",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Score" />
    ),
    cell: ({ row }) => (
      <ScoreBadge row={row} />
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "date",
    accessorKey: "datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
        const timeInMilliseconds = row.getValue("date") as number * 1000
        const date = new Date(timeInMilliseconds)
        return (
          <div className="text-sm text-gray-500 flex flex-col">
            <span>{date.toLocaleDateString()}</span>
            <span>{date.toLocaleTimeString([], { timeStyle: "short" })}</span>
          </div>
        )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "pros",
    accessorKey: "pros",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pros" />
    ),
    cell: ({ row }) => {
        const pros = row.getValue("pros") as string[]
        return (
            <ul className="list-disc list-inside text-green-500">
                {pros.map((pro, index) => (
                    <li key={index}>
                        <span className="text-black">{pro}</span>
                    </li>
                ))}
            </ul>
        )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "cons",
    accessorKey: "cons",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cons" />
    ),
    cell: ({ row }) => {
        const cons = row.getValue("cons") as string[]
        return (
            <ul className="list-disc list-inside text-red-500">
                {cons.map((con, index) => (
                    <li key={index}>
                        <span className="text-black">{con}</span>
                    </li>
                ))}
            </ul>
        )
    },
    enableSorting: false,
    enableHiding: true,
  }
]

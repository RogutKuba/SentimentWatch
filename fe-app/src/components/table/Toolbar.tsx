"use client"

import { Table } from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import ViewOptions from "@/components/table/ViewOptions"
import { SliderFilter } from "@/components/table/SliderFilter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export default function Toolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between px-4">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter by company..."
          value={(table.getColumn("company")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("company")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <SliderFilter type="min" table={table}/>
        <SliderFilter type="max" table={table}/>
      </div>
      <ViewOptions table={table} />
    </div>
  )
}
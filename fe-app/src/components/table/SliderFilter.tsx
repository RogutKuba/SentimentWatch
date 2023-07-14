import { useState } from "react"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"

interface DataTableSliderFilter<TData, TValue> {
  type: "max" | "min",
  table: Table<TData>
}

export function SliderFilter<TData, TValue>({
  type,
  table,
}: DataTableSliderFilter<TData, TValue>) {
  const [val, setVal] = useState(type === "max" ? 100 : 0)

  const handleSliderChange = (value: number[]) => {
    setVal(value[0])

    if (type === "max") {
      console.log("setting max")
      table.getColumn("score")?.setFilterValue((old: [number, number]) => {
        return [old?.[0] || 0, value[0]]
      })
    }
    else {
      table.getColumn("score")?.setFilterValue((old: [number, number]) => [value[0], old?.[1] || 100])
    } 
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex capitalize"
        >
          {type} - {val}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-4" align="start">
          <Slider step={1} min={0} max={100} value={[val]} onValueChange={handleSliderChange}/>
      </PopoverContent>
    </Popover>
  )
}
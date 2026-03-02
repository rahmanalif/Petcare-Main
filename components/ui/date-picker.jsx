"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ value, onChange, className, placeholder = "Pick a date" }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(undefined)

  // Parse the initial value (format: MM/DD/YYYY)
  React.useEffect(() => {
    if (value) {
      const parts = value.split("/")
      if (parts.length === 3) {
        const [month, day, year] = parts
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
        if (!isNaN(dateObj.getTime())) {
          setDate(dateObj)
        }
      }
    }
  }, [value])

  const handleSelect = (selectedDate) => {
    setDate(selectedDate)
    if (selectedDate) {
      // Format as MM/DD/YYYY
      const formatted = format(selectedDate, "MM/dd/yyyy")
      onChange(formatted)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function TimePicker({ value, onChange, className }) {
  const [open, setOpen] = React.useState(false)
  const [hours, setHours] = React.useState("12")
  const [minutes, setMinutes] = React.useState("00")
  const [period, setPeriod] = React.useState("AM")

  const hoursRef = React.useRef(null)
  const minutesRef = React.useRef(null)

  // Parse the initial value
  React.useEffect(() => {
    if (value) {
      const match = value.match(/(\d+):(\d+)(am|pm)/i)
      if (match) {
        setHours(match[1])
        setMinutes(match[2])
        setPeriod(match[3].toUpperCase())
      }
    }
  }, [value])

  // Scroll to selected hour/minute when popover opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (hoursRef.current) {
          const selectedHour = hoursRef.current.querySelector('[data-selected="true"]')
          if (selectedHour) {
            selectedHour.scrollIntoView({ block: 'center', behavior: 'instant' })
          }
        }
        if (minutesRef.current) {
          const selectedMinute = minutesRef.current.querySelector('[data-selected="true"]')
          if (selectedMinute) {
            selectedMinute.scrollIntoView({ block: 'center', behavior: 'instant' })
          }
        }
      }, 0)
    }
  }, [open])

  const handleTimeChange = (newHours, newMinutes, newPeriod) => {
    const formattedTime = `${newHours}:${newMinutes}${newPeriod.toLowerCase()}`
    onChange(formattedTime)
  }

  const selectHour = (hour) => {
    const formatted = String(hour).padStart(2, "0")
    setHours(formatted)
    handleTimeChange(formatted, minutes, period)
  }

  const selectMinute = (minute) => {
    const formatted = String(minute).padStart(2, "0")
    setMinutes(formatted)
    handleTimeChange(hours, formatted, period)
  }

  const hoursList = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutesList = Array.from({ length: 60 }, (_, i) => i)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value || "Pick a time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="flex items-start justify-center gap-2">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Hour</div>
              <div
                ref={hoursRef}
                className="h-48 w-16 overflow-y-auto border-2 border-[#024B5E] rounded-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {hoursList.map((hour) => {
                  const formatted = String(hour).padStart(2, "0")
                  const isSelected = hours === formatted
                  return (
                    <button
                      key={hour}
                      onClick={() => selectHour(hour)}
                      data-selected={isSelected}
                      className={cn(
                        "w-full py-2 text-center text-sm font-medium transition-colors hover:bg-[#024B5E] hover:text-white",
                        isSelected && "bg-[#024B5E] text-white"
                      )}
                    >
                      {formatted}
                    </button>
                  )
                })}
              </div>
            </div>

            <span className="text-2xl font-bold mt-6">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">Minute</div>
              <div
                ref={minutesRef}
                className="h-48 w-16 overflow-y-auto border-2 border-[#024B5E] rounded-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {minutesList.map((minute) => {
                  const formatted = String(minute).padStart(2, "0")
                  const isSelected = minutes === formatted
                  return (
                    <button
                      key={minute}
                      onClick={() => selectMinute(minute)}
                      data-selected={isSelected}
                      className={cn(
                        "w-full py-2 text-center text-sm font-medium transition-colors hover:bg-[#024B5E] hover:text-white",
                        isSelected && "bg-[#024B5E] text-white"
                      )}
                    >
                      {formatted}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col items-center gap-1 ml-2 mt-6">
              <Button
                variant={period === "AM" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPeriod("AM")
                  handleTimeChange(hours, minutes, "AM")
                }}
                className={cn(
                  "h-10 w-14 text-xs",
                  period === "AM" && "bg-[#024B5E] hover:bg-[#035F75]"
                )}
              >
                AM
              </Button>
              <Button
                variant={period === "PM" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPeriod("PM")
                  handleTimeChange(hours, minutes, "PM")
                }}
                className={cn(
                  "h-10 w-14 text-xs",
                  period === "PM" && "bg-[#024B5E] hover:bg-[#035F75]"
                )}
              >
                PM
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import * as React from "react"
import { DayPicker as CalendarPrimitive, DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface CalendarProps extends Omit<DayPickerProps, 'className' | 'classNames'> {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
}

const Calendar = React.forwardRef<
  React.ElementRef<any>, // Forzamos 'any' para el tipo de ref
  CalendarProps
>(({ className, classNames, showOutsideDays = true, ...props }, ref) => {
  return (
    <CalendarPrimitive
      // @ts-ignore: Ignore type checking for ref
      ref={ref}
      className={cn("p-3", className)}
      classNames={classNames}
      components={{
        IconLeft: ({ ...props }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            {...props}
          >
            <path d="M15 18L9 12L15 6" />
          </svg>
        ),
        IconRight: ({ ...props }) => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            {...props}
          >
            <path d="M9 18L15 12L9 6" />
          </svg>
        ),
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  )
})
Calendar.displayName = "Calendar"

export { Calendar }
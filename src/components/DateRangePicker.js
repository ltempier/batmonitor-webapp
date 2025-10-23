import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';

import { ChevronDownIcon, CalendarDays } from "lucide-react"

import { Button } from './ui/button';
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "./ui/input-group"


function DateRangePicker({ left, right, setLeft, setRight }) {

    const [leftCalendarOpen, setLeftCalendarOpen] = React.useState(false)
    const [date, setDate] = React.useState(undefined)

    const toString = (value) => typeof value === 'string' ? value : moment(value).format("YYYY-MM-DD HH:mm:ss.SSS")

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">{toString(left)}  -  {toString(right)}</Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-4" align="center" side="bottom">
                <div className="flex flex-col gap-4">
                    <div>
                        <Label htmlFor="from">From</Label>

                        <InputGroup>
                            <Popover>
                                <InputGroupInput
                                    id="from"
                                    placeholder={toString(left)}
                                    
                                />

                                <PopoverTrigger asChild>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton>
                                            <CalendarDays />
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={left}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {

                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </InputGroup>
                    </div>
                    <div>
                        <Label htmlFor="to">To</Label>
                        <InputGroup>
                            <Popover>

                                <InputGroupInput
                                    id="to"
                                    placeholder={toString(right)}
                                />

                                <PopoverTrigger asChild>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton>
                                            <CalendarDays />
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={right}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {

                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </InputGroup>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateRangePicker;
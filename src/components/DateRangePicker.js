import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CalendarDaysIcon, ExpandIcon } from "lucide-react";
import { Button } from './ui/button';
import { ButtonGroup } from "./ui/button-group"
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";


function parseDuration(str) {
    const regex = /^now([+-])(\d+)([smh])$/;
    const match = str.match(regex);
    if (!match)
        return null;

    const sign = match[1]
    return {
        sign, // "+" ou "-"
        value: (sign === "-" ? -1 : 1) * parseInt(match[2], 10),
        unit: match[3] // Unité s, m, ou h
    };
}

export const rangeValueToTimestamp = (value) => {

    const dateValue = moment(value)
    if (dateValue.isValid())
        return dateValue.valueOf()

    if (typeof value === 'string') {
        const strValue = value.replace(/\s+/g, '');
        if (strValue === 'now')
            return moment().add(1, 's').valueOf()

        const duration = parseDuration(strValue)
        if (duration) {
            const dateValue = moment().add(duration.value, duration.unit)
            return dateValue.valueOf()
        }
    }

    throw new Error('rangeValueToTimestamp err value not supported: ' + value)
}

const isRangeValueValid = (value) => {
    if (value == 'dataMin' || value == 'dataMax')
        return true

    try {
        rangeValueToTimestamp(value)
        return true
    } catch (e) {
        return false
    }
}

const rangeValueToString = (value) => {
    const dateValue = moment(value)
    if (dateValue.isValid())
        return dateValue.format('YYYY-MM-DD HH:mm:ss')
    return value
}

function DateRangePicker({ left, right, setLeft, setRight }) {

    const [open, setOpen] = useState(false);
    const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
    const [toCalendarOpen, setToCalendarOpen] = useState(false);

    const presetRanges = [
        { label: "Last 30 seconds", left: 'now-30s', right: 'now' },
        { label: "Last 1 minute", left: 'now-1m', right: 'now' },
        { label: "Last 5 minutes", left: 'now-5m', right: 'now' },
        { label: "Last 30 minutes", left: 'now-30m', right: 'now' },
        { label: "Last 1 hour", left: 'now-1h', right: 'now' },
        { label: "Last 3 hours", left: 'now-3h', right: 'now' },
        { label: "Last 6 hours", left: 'now-6h', right: 'now' },
        { label: "Last 24 hours", left: 'now-24h', right: 'now' },
        { label: "All data", left: 'dataMin', right: 'dataMax' },
    ];

    const [bufferFrom, setBufferFrom] = useState("");
    const [bufferTo, setBufferTo] = useState("");

    useEffect(() => {
        setBufferFrom(rangeValueToString(left))
        setBufferTo(rangeValueToString(right))
    }, [right, left])


    const handlePresetSelect = (preset) => {
        setLeft(preset.left);
        setRight(preset.right);
        setOpen(false)
    };

    const applyTimeRange = () => {
        if (isRangeValueValid(bufferFrom))
            setLeft(bufferFrom);
        if (isRangeValueValid(bufferTo))
            setRight(bufferTo);
        setOpen(false)
    }

    const zoomOut = () => {
        setLeft("dataMin");
        setRight("dataMax");
    }

    const goLeft = () => {
        try {
            const leftTimestamp = rangeValueToTimestamp(left)
            const rightTimestamp = rangeValueToTimestamp(right)
            setRight(leftTimestamp)
            setLeft(leftTimestamp + (leftTimestamp - rightTimestamp))
        } catch (e) {

        }
    }

    const goRight = () => {
        try {
            const leftTimestamp = rangeValueToTimestamp(left)
            const rightTimestamp = rangeValueToTimestamp(right)
            setLeft(rightTimestamp)
            setRight(rightTimestamp - (leftTimestamp - rightTimestamp))
        } catch (e) {

        }
    }


    const getTitle = () => {

        const range = presetRanges.find(item => item.left === left && item.right === right);
        if (range && range.label)
            return <span className="font-bold">{range.label}</span>

        let strLeft = left
        let strRight = right

        if (moment(left).isValid())
            strLeft = moment(left).format('YYYY-MM-DD HH:mm:ss')
        if (moment(right).isValid())
            strRight = moment(right).format('YYYY-MM-DD HH:mm:ss')

        return (
            <>
                <span className="font-bold">{strLeft}</span>
                <span className="mx-2">to</span>
                <span className="font-bold">{strRight}</span>
            </>
        )
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>

            <ButtonGroup>
                <ButtonGroup className="hidden sm:flex">
                    <Button variant="outline" size="icon" aria-label="Zoom out" onClick={zoomOut}>
                        <ExpandIcon />
                    </Button>
                </ButtonGroup>

                <ButtonGroup className="hidden sm:flex">
                    <Button variant="outline" size="icon" aria-label="Go Back" disabled={left === "dataMin"} onClick={goLeft}>
                        <ArrowLeftIcon />
                    </Button>
                </ButtonGroup>


                <PopoverTrigger asChild>
                    <ButtonGroup>
                        <Button variant="outline" className="flex items-center gap-x-1">
                            {getTitle()}
                        </Button>
                    </ButtonGroup>
                </PopoverTrigger>

                <ButtonGroup className="hidden sm:flex">
                    <Button variant="outline" size="icon" aria-label="Go Back" disabled={right === "dataMax"} onClick={goRight}>
                        <ArrowRightIcon />
                    </Button>
                </ButtonGroup>
            </ButtonGroup>


            <PopoverContent className="w-auto p-5" align="center" side="bottom">
                <div className="flex flex-row gap-4 ">
                    {/* Left Side: Date Pickers */}
                    <div className="flex flex-col gap-4 w-full relative">

                        <Label>Absolute time range</Label>
                        <div className='mt-2'>
                            <Label htmlFor="from">From</Label>
                            <InputGroup>
                                <Popover open={fromCalendarOpen} onOpenChange={setFromCalendarOpen}>
                                    <InputGroupInput
                                        id="from"
                                        placeholder="from"
                                        value={bufferFrom}
                                        onChange={(e) => setBufferFrom(e.target.value)}
                                    />
                                    <PopoverTrigger asChild>
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton >
                                                <CalendarDaysIcon />
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0">
                                        <Calendar
                                            mode="single"
                                            selected={left}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setBufferFrom(moment(date).format("YYYY-MM-DD HH:mm:ss"));
                                                setFromCalendarOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </InputGroup>

                            <Label htmlFor="to">To</Label>
                            <InputGroup>
                                <Popover open={toCalendarOpen} onOpenChange={setToCalendarOpen}>
                                    <InputGroupInput
                                        id="to"
                                        placeholder="to"
                                        value={bufferTo}
                                        onChange={(e) => setBufferTo(e.target.value)}
                                    />
                                    <PopoverTrigger asChild>
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton>
                                                <CalendarDaysIcon />
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0">
                                        <Calendar
                                            mode="single"
                                            selected={left}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setBufferTo(moment(date).format("YYYY-MM-DD HH:mm:ss"));
                                                setToCalendarOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </InputGroup>
                        </div>

            
                        <div className="mt-4 flex justify-center">
                            <Button onClick={applyTimeRange}>Apply time range</Button>
                        </div>
                    </div>

                    <Separator orientation="vertical" className="h-auto" />

                    {/* Right Side: Selectable Table */}
                    <div className="flex flex-col gap-2 w-1/2">
                        <Label>Preset Ranges</Label>
                        <div className="flex flex-col gap-1">
                            <Table>
                                <TableBody>
                                    {presetRanges.map((preset) => (
                                        <TableRow
                                            key={preset.label}
                                            onClick={() => handlePresetSelect(preset)}
                                            className='cursor-pointer'
                                        >
                                            <TableCell className="py-2 whitespace-nowrap">{preset.label}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default DateRangePicker;


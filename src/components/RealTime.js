import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Brush } from 'recharts';

import { Card, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"

import { useApp } from '../context/AppContext';

function RealTime() {
    const { realTimeData, realTimeRefreshTime, setRealTimeRefreshTime, refreshRealTimeData } = useApp();

    const vColor = '#03a5fc';
    const aColor = '#d32525';

    // Chart configurations for each channel
    const chartConfigs = [
        {
            title: 'Channel 1',
            dataKeys: { voltage: 'v1', current: 'a1' },
        },
        {
            title: 'Channel 2',
            dataKeys: { voltage: 'v2', current: 'a2' },
        },
        {
            title: 'Channel 3',
            dataKeys: { voltage: 'v3', current: 'a3' },
        },
    ];


    const CustomTick = ({ x, y, payload }) => {
        // Formater la date avec moment
        const tickDate = moment.utc(payload.value);
        const datePart = tickDate.format('YYYY-MM-DD');
        const timePart = tickDate.format('HH:mm:ss');

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={-6} textAnchor="middle" fill="#ccc">
                    {datePart}
                </text>
                <text x={0} y={9} textAnchor="middle" fill="#ccc">
                    {timePart}
                </text>
            </g>
        );
    };

    return (
        <div>
            <Card className="mb-1 p-4">
                <CardTitle className="flex items-center justify-between">  {/* 🎯 AJOUTÉ */}
                    <div className="flex items-center gap-2">  {/* 🎯 AJOUTÉ */}
                        <Button onClick={refreshRealTimeData}>Refresh</Button>
                        <Select value={realTimeRefreshTime || 0} onValueChange={setRealTimeRefreshTime}>
                            <SelectTrigger aria-label="Auto refresh" className="w-[120px]">
                                <SelectValue placeholder="Off" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={0} className="rounded-lg">Off</SelectItem>
                                <SelectItem value={1000} className="rounded-lg">1s</SelectItem>
                                <SelectItem value={5000} className="rounded-lg">5s</SelectItem>
                                <SelectItem value={30000} className="rounded-lg">30s</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardTitle>
            </Card>

            {chartConfigs.map((config, index) => (
                <Card key={index} className="mb-1">
                    <CardTitle className="text-center m-2">{config.title}</CardTitle>
                    <CardContent>
                        <ChartContainer
                            config={{
        
                            }}
                            className="h-[300px] w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={realTimeData}
                                    animationDuration={0}
                                    syncId="realtime-sync"
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="date"
                                        tick={<CustomTick />} // Utilisation du tick personnalisé
                                        tickMargin={20}
                                    />
                                    <YAxis
                                        yAxisId="voltage"
                                        domain={['auto', 'auto']}
                                        label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }}
                                        tickFormatter={(value) => value.toFixed(2) + ' V'}

                                    />
                                    <YAxis
                                        yAxisId="current"
                                        domain={['auto', 'auto']}
                                        orientation="right"
                                        label={{ value: 'Current (A)', angle: 90, position: 'insideRight' }}
                                        tickFormatter={(value) => value.toFixed(2) + ' A'}

                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    //   formatter={(value, name) => [value.toFixed(2), chartConfig[name].label]}
                                    />
                                    <Line
                                        yAxisId="voltage"
                                        type="monotone"
                                        dataKey={config.dataKeys.voltage}
                                        stroke={vColor}
                                        strokeWidth={1}
                                        dot={false}
                                        isAnimationActive={false}

                                    />
                                    <Line
                                        yAxisId="current"
                                        type="monotone"
                                        dataKey={config.dataKeys.current}
                                        stroke={aColor}
                                        strokeWidth={1}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default RealTime;
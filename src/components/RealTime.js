import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Brush } from 'recharts';
import { Card, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
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
                <Button onClick={refreshRealTimeData}>Refresh</Button>
            </Card>

            {chartConfigs.map((config, index) => (
                <Card key={index} className="mb-1 p-4">
                    <CardTitle className="text-center">{config.title}</CardTitle>
                    <CardContent>
                        <ChartContainer
                            config={{}}
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
                                        stroke="#ccc"
                                        tick={<CustomTick />} // Utilisation du tick personnalisé
                                        tickMargin={20}
                                    />
                                    <YAxis
                                        yAxisId="voltage"
                                        domain={[0, 14]}
                                        label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: '#ccc' }}
                                        tickFormatter={(value) => value.toFixed(2)}
                                        stroke="#ccc"
                                        tick={{ fill: '#ccc' }}
                                    />
                                    <YAxis
                                        yAxisId="current"
                                        domain={[0, 2]}
                                        orientation="right"
                                        label={{ value: 'Current (A)', angle: 90, position: 'insideRight', fill: '#ccc' }}
                                        tickFormatter={(value) => value.toFixed(2)}
                                        stroke="#ccc"
                                        tick={{ fill: '#ccc' }}
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
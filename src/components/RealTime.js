import React, { useState, useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea } from 'recharts';
import { RefreshCcwIcon, LoaderIcon } from "lucide-react";

import { Card, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

import DateRangePicker, { rangeValueToTimestamp } from "./DateRangePicker"


import { useApp } from '../context/AppContext';

function RealTime() {
    const { isRealTimeDataLoading, realTimeData, realTimeRefreshTime, setRealTimeRefreshTime, refreshRealTimeData } = useApp();

    const [left, setLeft] = useState("dataMin");
    const [right, setRight] = useState("dataMax");

    const [chartData, setChartData] = useState([]);
    const [xAxisDomain, setXAxisDomain] = useState([left, right]);

    useEffect(() => {
        let minTimestamp = null
        let maxTimestamp = null
        try {
            minTimestamp = rangeValueToTimestamp(left)
        } catch (e) { }
        try {
            maxTimestamp = rangeValueToTimestamp(right)
        } catch (e) { }

        setXAxisDomain([
            minTimestamp ? minTimestamp : 'dataMin',
            maxTimestamp ? maxTimestamp : 'dataMax'
        ])

        if (left === "dataMin" && right === "dataMax")
            return setChartData([...realTimeData])

        const filteredData = realTimeData.filter((data) => {
            let afterMin = (left === "dataMin") || data.timestamp >= minTimestamp
            let beforeMax = (right === "dataMax") || data.timestamp <= maxTimestamp
            return afterMin && beforeMax
        })
        setChartData(filteredData)
    }, [realTimeData, left, right])


    const [zoomGraph, setZoomGraph] = useState({
        refAreaLeft: null,
        refAreaRight: null,
    });

    const vColor = '#03a5fc';
    const aColor = '#d32525';

    // Configuration des canaux pour chaque graphique
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

    // Personnalisation de l'affichage des ticks de l'axe des X
    const CustomTimeTick = ({ x, y, payload }) => {
        try {
            const tickDate = moment(payload.value);
            const datePart = tickDate.format('YYYY-MM-DD');
            const timePart = tickDate.format('HH:mm:ss');
            return (
                <g transform={`translate(${x},${y})`}>
                    <text x={0} y={-5} textAnchor="middle" fill="#ccc">
                        {datePart}
                    </text>
                    <text x={0} y={9} textAnchor="middle" fill="#ccc">
                        {timePart}
                    </text>
                </g>
            );
        } catch (e) {
            return null;
        }
    };

    const onMouseDown = useCallback((e) => {
        setZoomGraph((prev) => ({ ...prev, refAreaLeft: e.activeLabel }));
    }, []);

    const onMouseMove = useCallback((e) => {
        if (zoomGraph.refAreaLeft && e.activeLabel >= 0) {
            setZoomGraph((prev) => ({
                ...prev,
                refAreaRight: e.activeLabel,
            }));
        }
    }, [zoomGraph.refAreaLeft]);

    const onMouseUp = useCallback(() => {
        setZoomGraph((currentZoom) => {
            if (currentZoom.refAreaLeft && currentZoom.refAreaRight) {
                const leftVal = Math.min(Number(currentZoom.refAreaLeft), Number(currentZoom.refAreaRight));
                const rightVal = Math.max(Number(currentZoom.refAreaRight), Number(currentZoom.refAreaLeft));

                if (rightVal > (moment().valueOf() - 5000))
                    setRight("now");
                else
                    setRight(rightVal);

                setLeft(leftVal);
            }
            return { refAreaLeft: null, refAreaRight: null };
        });
    }, []);

    return (
        <div>
            <div className="mb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button onClick={refreshRealTimeData} disabled={isRealTimeDataLoading}>
                            {isRealTimeDataLoading ? <LoaderIcon className='animate-spin' /> : <RefreshCcwIcon />}
                            Refresh
                        </Button>
                        <Select value={realTimeRefreshTime || 0} onValueChange={setRealTimeRefreshTime}>
                            <SelectTrigger aria-label="Auto refresh" >
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


                    <div className="flex items-center">
                        <DateRangePicker
                            left={zoomGraph.refAreaLeft || left}
                            right={zoomGraph.refAreaRight || right}
                            setLeft={setLeft}
                            setRight={setRight}
                        />
                    </div>
                </div>
            </div>

            {chartConfigs.map((config, index) => (
                <Card key={index} className="mb-2">
                    <CardTitle className="text-center m-2">{config.title}</CardTitle>
                    <CardContent>
                        <ChartContainer
                            config={config}
                            className="h-[300px] w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    animationDuration={0}
                                    syncId="realtime-sync"
                                    onMouseDown={onMouseDown}
                                    onMouseMove={onMouseMove}
                                    onMouseUp={onMouseUp}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="timestamp"
                                        name='Time'
                                        type="number"
                                        tick={<CustomTimeTick />} // Utilisation du tick personnalisé
                                        tickMargin={20}
                                        domain={xAxisDomain}
                                        // padding={10}
                                        allowDataOverflow
                                    />

                                    <YAxis
                                        yAxisId="voltage"
                                        domain={['dataMin - 1', 'dataMax + 1']}
                                        label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft' }}
                                        tickFormatter={(value) => value.toFixed(2) + ' V'}
                                    />
                                    <YAxis
                                        yAxisId="current"
                                        domain={['0', 'dataMax + 0.1']}
                                        orientation="right"
                                        label={{ value: 'Current (A)', angle: 90, position: 'insideRight' }}
                                        tickFormatter={(value) => value.toFixed(2) + ' A'}
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                        labelFormatter={(label, payload) => {
                                            if (payload && payload.length > 0) {
                                                const item = payload[0]; // Prends le premier élément du payload
                                                const timestamp = item?.payload?.timestamp;
                                                if (timestamp) {
                                                    return `Time ${moment(timestamp).format("HH:mm:ss,SS")}`;
                                                }
                                            }
                                            return "Timestamp non disponible";
                                        }}
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
                                    {zoomGraph.refAreaLeft && zoomGraph.refAreaRight && (
                                        <ReferenceArea
                                            yAxisId="voltage" x1={zoomGraph.refAreaLeft} x2={zoomGraph.refAreaRight} fillOpacity={0.1}
                                        />
                                    )}
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

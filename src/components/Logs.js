import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Dot, LoaderIcon, ExternalLink, Download, ChevronDown, RefreshCcwIcon } from "lucide-react";

import { Card, CardTitle, CardContent, CardHeader, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "./ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "./ui/collapsible"


function Logs() {

    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState([]);

    const fetchLogs = () => {
        setIsLoading(true)
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/logs`)
            .then((response) => {
                setLogs(response.data)
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des données API:', error);
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div className="">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchLogs} disabled={isLoading}>
                        {isLoading ? <LoaderIcon className='animate-spin' /> : <RefreshCcwIcon />}
                        Refresh
                    </Button>
                </div>
            </div>

            <Card className="">
                <CardContent className="p-0">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Tag</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{log[0]}</TableCell>
                                    <TableCell className="!w-full">{log[1]}</TableCell >
                                    <TableCell >{log[2]}</TableCell >
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card >
        </div >
    );
}

export default Logs;

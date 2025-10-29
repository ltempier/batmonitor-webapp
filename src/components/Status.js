import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Dot, LoaderIcon, ExternalLink, Download, ChevronDown, RefreshCcwIcon } from "lucide-react";

import { Card, CardTitle, CardContent, CardHeader, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "./ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "./ui/collapsible"


function Status() {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchStatus = () => {
        setIsLoading(true)
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/status`)
            .then((response) => {
                setData(response.data)
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des données API:', error);
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchStatus()
    }, [])

    return (
        <div className="">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchStatus} disabled={isLoading}>
                        {isLoading ? <LoaderIcon className='animate-spin' /> : <RefreshCcwIcon />}
                        Refresh
                    </Button>
                </div>
            </div>

            {data && Object.keys(data).map((key) => (
                <Card key={key} className="mb-2">
                    <CardHeader>
                        <CardTitle>{key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="">
                            {Object.keys(data[key]).map((subKey) => {
                                const value = data[key][subKey];

                                let strValue = "" + value
                                if (Array.isArray(value))
                                    strValue = `[${value.join(',')}]`

                                return (
                                    <div key={subKey} className="flex items-center space-x-2">
                                        <Dot className="" size={12} />
                                        <span className="font-medium"> {subKey} : </span>
                                        <span className="text-blue-500">{strValue}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Status;

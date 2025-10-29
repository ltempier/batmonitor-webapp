import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { RefreshCcwIcon, LoaderIcon, ExternalLink, Download, ChevronDown, Dot, Eye, WifiIcon, WifiOffIcon } from "lucide-react";

import { Card, CardTitle, CardContent, CardHeader, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "./ui/select"
import { Table, TableHead, TableHeader, TableBody, TableCell, TableRow } from "./ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "./ui/collapsible"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, } from "./ui/field"
import { Input } from "./ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, } from "./ui/input-group"

import { useApp } from '../context/AppContext';

function Wifi() {

    const [showPassword, setShowPassword] = useState(false);

    const [isLoadingSsidList, setIsLoadingSsidList] = useState(false);
    const [ssidList, setSsidList] = useState([]);
    const [wifiStatus, setWifiStatus] = useState(null);

    const fetchStatus = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/status`)
            .then((response) => {
                setWifiStatus(response.data?.wifi)
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des données API:', error);
            })
            .finally(() => { })
    }

    const fetchSsidList = () => {
        setIsLoadingSsidList(true)
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/ssidList`)
            .then((response) => {
                setSsidList(response.data)
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des données API:', error);
            })
            .finally(() => {
                setIsLoadingSsidList(false)
            })
    }

    useEffect(() => {
        fetchStatus()
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        const data = new FormData(event.target); // Récupère les données du formulaire

        const params = new URLSearchParams();
        params.append('ssid', data.get('ssid'));
        params.append('password', data.get('password'));

        axios.post(`${process.env.REACT_APP_BASE_URL}/api/connect`, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
                console.log('Connected:', response);
            }).catch((error) => {
                console.error('Connection failed:', error);
            });
    };

    return (
        <div className="">
            <Card className="mb-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {wifiStatus ? (wifiStatus.isConnect  ? <WifiIcon className="w-5 h-5 text-green-500" /> : <WifiOffIcon className="w-5 h-5 text-red-500" />) : <WifiIcon className="w-5 h-5" />}
                        Wifi status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="">
                        {wifiStatus && Object.keys(wifiStatus).map((key) => {
                            const value = wifiStatus[key];

                            let strValue = "" + value
                            if (Array.isArray(value))
                                strValue = `[${value.join(',')}]`

                            return (
                                <div key={key} className="flex items-center space-x-2">
                                    <Dot className="" size={12} />
                                    <span className="font-medium"> {key} : </span>
                                    <span className="text-blue-500">{strValue}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>


            <Card className="">
                <CardHeader className="">
                    <CardTitle>Wifi configuration</CardTitle>
                </CardHeader>
                <CardContent>

                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">SSID</FieldLabel>

                                <div className="flex w-full items-center gap-2">
                                    <Select name="ssid" required >
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    ssidList.length > 0 ? ssidList.map((ssid, index) => (
                                                        <SelectItem key={index} value={ssid}>{ssid}</SelectItem>
                                                    )) : <SelectItem disabled>No networks available</SelectItem>
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" type="button" onClick={fetchSsidList} disabled={isLoadingSsidList}>
                                        {isLoadingSsidList ? <LoaderIcon className='animate-spin' /> : <RefreshCcwIcon />}
                                        Scan
                                    </Button>
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput name="password" placeholder="Enter password" type={showPassword ? "text" : "password"} required />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
                                            <Eye />
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Field>
                            <Field>
                                <Button type="submit">Connect</Button>
                            </Field>
                        </FieldGroup>

                    </form>
                </CardContent>
            </Card>
        </div>

    );
}

export default Wifi;
